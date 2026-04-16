import {
  AttendanceDto,
  ChildAttendanceReportModel,
  ClassRoomChildAttendanceMonthlyReportModel,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import {
  TrackAttendanceAttendeeModelInput,
  TrackAttendanceModelInput,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AttendanceService } from '@services/AttendanceService';
import { RootState, ThunkApiType } from '../types';
import { MonthlyAttendanceReportQueryParams } from './attendance.types';
import { RetrieveFromCache } from '@/models/sync/retrieve-from-cache';
import { OverrideCache } from '@/models/sync/override-cache';

export const AttendanceActions = {
  GET_ATTENDANCE: 'getAttendance',
  GET_MONTHLY_ATTENDANCE_REPORT: 'getMonthlyAttendanceReport',
  TRACK_ATTENDANCE_SYNC: 'trackAttendanceSync',
  GET_CLASSROOM_ATTENDANCE_REPORT: 'getClassroomAttendanceReport',
};

export const getAttendance = createAsyncThunk<
  AttendanceDto[],
  { startDate: Date; endDate: Date },
  ThunkApiType<RootState>
>(
  AttendanceActions.GET_ATTENDANCE,
  async ({ startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      attendanceData: { attendance: attendanceCache },
    } = getState();

    if (!attendanceCache) {
      try {
        let attendance: AttendanceDto[] | undefined;

        if (userAuth?.auth_token) {
          attendance = await new AttendanceService(
            userAuth?.auth_token
          ).getAttendance(startDate, endDate);
        }

        if (!attendance) {
          return rejectWithValue('Error getting Attendance Records');
        }

        return attendance;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return attendanceCache;
    }
  }
);

// This should probably be removed and the above used to get all relevant attendance data
export const getPreviousWeekAttendance = createAsyncThunk<
  AttendanceDto[],
  { startDate: Date; endDate: Date },
  ThunkApiType<RootState>
>(
  'getPreviousWeekAttendance',
  async ({ startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let attendance: AttendanceDto[] | undefined;

      if (userAuth?.auth_token) {
        attendance = await new AttendanceService(
          userAuth?.auth_token
        ).getAttendance(startDate, endDate);
      }

      if (!attendance) {
        return rejectWithValue('Error getting Attendance Records');
      }

      return attendance;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getMonthlyAttendanceReport = createAsyncThunk<
  MonthlyAttendanceRecord[],
  MonthlyAttendanceReportQueryParams & OverrideCache,
  ThunkApiType<RootState>
>(
  AttendanceActions.GET_MONTHLY_ATTENDANCE_REPORT,
  async (
    { userId, startDate, endDate, overrideCache },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      attendanceData: { monthlyAttendanceRecordsByUser },
    } = getState();

    const records = monthlyAttendanceRecordsByUser[userId]?.data;

    if (!overrideCache && records && records.length !== 0) {
      return records;
    }

    try {
      let reportData: MonthlyAttendanceRecord[] | undefined;

      if (userAuth?.auth_token) {
        reportData = await new AttendanceService(
          userAuth?.auth_token
        ).getMonthlyAttendanceReport(startDate, endDate);
      }

      if (!reportData) {
        return rejectWithValue('Error getting Monthly Attendance Report');
      }

      return reportData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getChildAttendanceRecords = createAsyncThunk<
  ChildAttendanceReportModel,
  { userId: string; classgroupId: string; startDate: Date; endDate: Date },
  ThunkApiType<RootState>
>(
  'attendance/getChildAttendanceRecords', // ← more specific & conventional prefix
  async (
    { userId, classgroupId, startDate, endDate },
    { getState, rejectWithValue }
  ) => {
    const state = getState();
    const { userAuth } = state.auth;

    const cachedData = state.attendanceData.attendanceByUserId?.[userId]?.data;

    // Early return from cache (most common happy path should be fast)
    if (cachedData) {
      if (
        cachedData.attendancePercentage !== 0 &&
        cachedData.totalExpectedAttendance !== 0 &&
        cachedData.totalActualAttendance !== 0
      ) {
        return cachedData;
      }
    }

    // Normalize userId – use current authenticated user when empty
    const effectiveUserId = userId || userAuth?.id;

    if (!effectiveUserId) {
      return rejectWithValue('No user ID available');
    }

    if (!userAuth?.auth_token) {
      return rejectWithValue('Not authenticated');
    }

    try {
      const service = new AttendanceService(userAuth.auth_token);

      const report = await service.getChildAttendanceRecords(
        effectiveUserId,
        classgroupId,
        startDate,
        endDate
      );

      if (!report) {
        return rejectWithValue('Received empty attendance report');
      }

      return report;
    } catch (err: any) {
      // Usually better to pass meaningful message + original error
      return rejectWithValue(
        err?.message || 'Failed to fetch child attendance records'
      );
    }
  }
);

export const trackAttendanceSync = createAsyncThunk<
  TrackAttendanceModelInput[] | undefined,
  any,
  ThunkApiType<RootState>
>(
  AttendanceActions.TRACK_ATTENDANCE_SYNC,
  async (any, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      attendanceData: { attendanceTracked },
    } = getState();
    try {
      let promises: Promise<TrackAttendanceModelInput>[] = [];

      if (userAuth && attendanceTracked) {
        promises = attendanceTracked.map(async (x) => {
          if (x?.synced) return Promise.resolve(x);

          const trackAttendanceModelInput: TrackAttendanceModelInput = {
            classroomProgrammeId: x.classroomProgrammeId,
            programmeOwnerId: x.programmeOwnerId,
            attendees: [],
            attendanceDate: x.attendanceDate,
          };

          trackAttendanceModelInput.attendees = [];

          x.attendees?.forEach((z) => {
            const trackAttendanceAttendeeModelInput: TrackAttendanceAttendeeModelInput =
              {
                userId: z.userId,
                attended: z.attended,
              };
            trackAttendanceModelInput.attendees?.push(
              trackAttendanceAttendeeModelInput
            );
          });

          await new AttendanceService(userAuth?.auth_token).trackAttendance([
            trackAttendanceModelInput,
          ]);

          return trackAttendanceModelInput;
        });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getClassroomAttendanceReport = createAsyncThunk<
  { data: ClassRoomChildAttendanceMonthlyReportModel } & RetrieveFromCache,
  { startDate: Date | string; endDate: Date | string },
  ThunkApiType<RootState>
>(
  'attendance/getClassroomAttendanceReport',
  async ({ startDate, endDate }, { getState, rejectWithValue }) => {
    const state = getState();
    const { userAuth } = state.auth;
    const { classroomAttendanceOverviewReport } = state.attendanceData;

    if (!userAuth?.auth_token) {
      return rejectWithValue('No access token – please check profile/login');
    }

    // ────────────────────────────────────────────────────────────────
    // Normalize incoming args to YYYY-MM-DD string (timezone-safe) - same as builder
    // ────────────────────────────────────────────────────────────────
    const normalize = (input: Date | string): string => {
      const date = typeof input === 'string' ? new Date(input) : input;
      return date.toISOString().split('T')[0];
    };

    const reqStart = normalize(startDate);
    const reqEnd = normalize(endDate);

    const cached = classroomAttendanceOverviewReport.find(
      (report) => report.startDate === reqStart && report.endDate === reqEnd
    );

    if (cached) {
      return { data: cached.data, retrievedFromCache: true };
    }

    try {
      const result = await new AttendanceService(
        userAuth.auth_token
      ).getClassroomAttendanceReport(new Date(startDate), new Date(endDate));

      return { data: result, retrievedFromCache: false };
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Failed to fetch classroom attendance report'
      );
    }
  }
);
