import {
  AttendanceDto,
  ChildAttendanceReportModel,
  ClassRoomChildAttendanceMonthlyReportModel,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import {
  QueryClassroomAttendanceOverviewReportArgs,
  TrackAttendanceAttendeeModelInput,
  TrackAttendanceModelInput,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AttendanceService } from '@services/AttendanceService';
import { RootState, ThunkApiType } from '../types';
import {
  ChildAttendanceReportQueryParams,
  MonthlyAttendanceReportQueryParams,
} from './attendance.types';
import { RetrieveFromCache } from '@/models/sync/retrieve-from-cache';
import { isSameDay, parseISO } from 'date-fns';
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

    let oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const dateRefreshed = monthlyAttendanceRecordsByUser[userId]?.dateRefreshed;

    if (
      !overrideCache &&
      dateRefreshed &&
      new Date(dateRefreshed) > oneDayAgo
    ) {
      return monthlyAttendanceRecordsByUser[userId].data;
    }

    try {
      let reportData: MonthlyAttendanceRecord[] | undefined;

      if (userAuth?.auth_token) {
        reportData = await new AttendanceService(
          userAuth?.auth_token
        ).getMonthlyAttendanceReport(userId, startDate, endDate);
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
  ChildAttendanceReportQueryParams,
  ThunkApiType<RootState>
>(
  'getChildAttendanceRecords',
  async (
    { classgroupId, startDate, endDate },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let reportData: ChildAttendanceReportModel | undefined;

      if (userAuth?.auth_token) {
        reportData = await new AttendanceService(
          userAuth?.auth_token
        ).getChildAttendanceRecords(
          userAuth.id,
          classgroupId,
          startDate,
          endDate
        );
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
  QueryClassroomAttendanceOverviewReportArgs,
  ThunkApiType<RootState>
>(
  AttendanceActions.GET_CLASSROOM_ATTENDANCE_REPORT,
  async ({ startDate, endDate, userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      attendanceData: { classroomAttendanceOverviewReport },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        let oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const cachedData = classroomAttendanceOverviewReport?.find(
          (report) =>
            isSameDay(parseISO(report.startDate), startDate) &&
            isSameDay(parseISO(report.endDate), endDate)
        );

        if (
          cachedData?.dateRefreshed &&
          new Date(cachedData.dateRefreshed) > oneDayAgo
        ) {
          return { data: cachedData.data, retrievedFromCache: true };
        }

        const result = await new AttendanceService(
          userAuth?.auth_token ?? ''
        ).getClassroomAttendanceReport(userId ?? '', startDate, endDate);

        return { data: result, retrievedFromCache: false };
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
