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
  AttendanceQueryParams,
  ChildAttendanceReportQueryParams,
  MonthlyAttendanceReportQueryParams,
} from './attendance.types';

export const AttendanceActions = {
  GET_MONTHLY_ATTENDANCE_REPORT: 'getMonthlyAttendanceReport',
};

export const getAttendance = createAsyncThunk<
  AttendanceDto[],
  AttendanceQueryParams,
  ThunkApiType<RootState>
>(
  'getAttendance',
  async ({ year, monthOfYear, weekOfYear }, { getState, rejectWithValue }) => {
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
          ).getAttendance(year, monthOfYear, weekOfYear);
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

export const getPreviousWeekAttendance = createAsyncThunk<
  AttendanceDto[],
  AttendanceQueryParams,
  ThunkApiType<RootState>
>(
  'getPreviousWeekAttendance',
  async ({ year, monthOfYear, weekOfYear }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let attendance: AttendanceDto[] | undefined;

      if (userAuth?.auth_token) {
        attendance = await new AttendanceService(
          userAuth?.auth_token
        ).getAttendance(year, monthOfYear, weekOfYear);
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
  async (
    { userId, classroomId, startDate, endDate },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let reportData: MonthlyAttendanceRecord[] | undefined;

      if (userAuth?.auth_token) {
        reportData = await new AttendanceService(
          userAuth?.auth_token
        ).getMonthlyAttendanceReport(userId, classroomId, startDate, endDate);
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
>('trackAttendanceSync', async (any, { getState, rejectWithValue }) => {
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
});
