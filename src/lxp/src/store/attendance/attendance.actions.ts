import {
  AttendanceDto,
  ChildAttendanceReportModel,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';
import {
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

export const AttendanceActions = {
  GET_ATTENDANCE: 'getAttendance',
  GET_MONTHLY_ATTENDANCE_REPORT: 'getMonthlyAttendanceReport',
  TRACK_ATTENDANCE_SYNC: 'trackAttendanceSync',
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
  MonthlyAttendanceReportQueryParams,
  ThunkApiType<RootState>
>(
  'getMonthlyAttendanceReport',
  async ({ userId, startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

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
  boolean[],
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
      let promises: Promise<boolean>[] = [];

      if (userAuth && attendanceTracked) {
        promises = attendanceTracked.map(async (x) => {
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

          return await new AttendanceService(
            userAuth?.auth_token
          ).trackAttendance([trackAttendanceModelInput]);
        });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
