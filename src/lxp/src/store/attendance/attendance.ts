import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWeek, getYear } from 'date-fns';
import localForage from 'localforage';
import {
  getAttendance,
  getChildAttendanceRecords,
  getClassroomAttendanceReport,
  getMonthlyAttendanceReport,
  getPreviousWeekAttendance,
  trackAttendanceSync,
} from './attendance.actions';
import { AttendanceState, TrackAttendanceModelInput } from './attendance.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { ToUtcDateString } from '@/utils/common/date.utils';

const initialState: AttendanceState = {
  attendance: undefined,
  attendanceTracked: undefined,
  monthlyAttendanceRecordsByUser: {},
  classroomAttendanceOverviewReport: [],
  attendanceByUserId: {},
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    resetAttendanceState: (state) => {
      state.attendance = initialState.attendance;
      state.attendanceTracked = initialState.attendanceTracked;
    },
    resetClassAttendanceForUser: (
      state,
      action: PayloadAction<{ userId: string }>
    ) => {
      const { userId } = action.payload;
      const group = state.attendanceByUserId[userId];

      if (group) {
        group.data = {
          totalExpectedAttendance: 0,
          totalActualAttendance: 0,
          attendancePercentage: 0,
          classGroupAttendance: [],
        };
      }
    },
    resetClassroomAttendanceOverviewReport: (state) => {
      state.classroomAttendanceOverviewReport = [];
    },
    trackAttendance: (
      state,
      action: PayloadAction<TrackAttendanceModelInput>
    ) => {
      if (!state.attendanceTracked) state.attendanceTracked = [];

      state.attendanceTracked?.push(action.payload);

      if (!state.attendance) state.attendance = [];

      const attendanceDate = new Date(action.payload.attendanceDate);

      if (action.payload.attendees) {
        const week = getWeek(attendanceDate) + 1;
        const year = getYear(attendanceDate);
        const month = attendanceDate.getUTCMonth() + 1;

        for (const attendee of action.payload.attendees) {
          const existingIndex = state.attendance?.findIndex(
            (x) =>
              x.userId === attendee.userId &&
              x.attendanceDate?.toString().slice(0, 10) ===
                action.payload.attendanceDate.toString().slice(0, 10) &&
              x.classroomProgrammeId === action.payload.classroomProgrammeId
          );

          const input = {
            classroomProgrammeId: action.payload.classroomProgrammeId,
            attendanceDate: ToUtcDateString(attendanceDate as Date),
            attended: attendee.attended,
            userId: attendee.userId,
            monthOfYear: month,
            weekOfYear: week,
            year: year,
          };
          if (existingIndex >= 0) {
            state.attendance[existingIndex] = input;
          } else {
            state.attendance.push(input);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getMonthlyAttendanceReport);
    setThunkActionStatus(builder, getClassroomAttendanceReport);
    setThunkActionStatus(builder, trackAttendanceSync);

    builder.addCase(getClassroomAttendanceReport.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      // ────────────────────────────────────────────────
      // 1. Get the requested date range
      // ────────────────────────────────────────────────
      const requestedStart = action.meta.arg.startDate; // Date | string
      const requestedEnd = action.meta.arg.endDate; // Date | string

      // Normalize to consistent format for comparison (YYYY-MM-DD)
      const normalizeDate = (date: Date | string): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString().split('T')[0];
      };

      const reqStartStr = normalizeDate(requestedStart);
      const reqEndStr = normalizeDate(requestedEnd);

      // ────────────────────────────────────────────────
      // 2. Find existing report using normalized strings
      // ────────────────────────────────────────────────
      const index = state.classroomAttendanceOverviewReport.findIndex(
        (item) => item.startDate === reqStartStr && item.endDate === reqEndStr
      );

      // ────────────────────────────────────────────────
      // 3. Prepare the data we will store
      //    → decide whether to store local YYYY-MM-DD or UTC
      // ────────────────────────────────────────────────
      const storedStart = normalizeDate(requestedStart); // consistent with comparison
      const storedEnd = normalizeDate(requestedEnd);

      const newReportEntry = {
        startDate: storedStart,
        endDate: storedEnd,
        data: action.payload.data,
        dateRefreshed: new Date().toISOString(), // ← better than .toDateString()
        isRevoked: false,
      };

      if (index === -1) {
        state.classroomAttendanceOverviewReport.push(newReportEntry);
      } else {
        Object.assign(
          state.classroomAttendanceOverviewReport[index],
          newReportEntry
        );
      }
    });

    builder.addCase(trackAttendanceSync.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      for (const register of action?.payload ?? []) {
        const programmeOwnerId = register.programmeOwnerId;
        const date = register.attendanceDate.split('T')[0];

        // reset the dateRefreshed for the monthly attendance report
        if (
          programmeOwnerId &&
          state.monthlyAttendanceRecordsByUser &&
          state.monthlyAttendanceRecordsByUser[programmeOwnerId]
        ) {
          state.monthlyAttendanceRecordsByUser[programmeOwnerId].dateRefreshed =
            undefined;
        }
        //state.classroomAttendanceOverviewReport = [];
        state.attendanceTracked = state.attendanceTracked?.map((x) => {
          const currentDate = (x.attendanceDate as string).split('T')[0];
          if (currentDate === date) {
            return {
              ...x,
              synced: true,
            };
          }
          return x;
        });
      }
    });
    builder.addCase(getAttendance.fulfilled, (state, action) => {
      state.attendance = action.payload;
    });
    builder.addCase(getChildAttendanceRecords.fulfilled, (state, action) => {
      const { userId } = action.meta.arg;

      state.attendanceByUserId[userId] = {
        ...(state.attendanceByUserId[userId] ?? {
          data: null,
        }),
        data: {
          attendancePercentage: action.payload.attendancePercentage,
          totalActualAttendance: action.payload.totalActualAttendance,
          totalExpectedAttendance: action.payload.totalExpectedAttendance,
          classGroupAttendance: action.payload.classGroupAttendance,
        },
      };
    });
    builder.addCase(getPreviousWeekAttendance.fulfilled, (state, action) => {
      if (!state.attendance) state.attendance = [];

      for (const element of action.payload) {
        const existingIndex = state.attendance?.findIndex(
          (x) =>
            x.userId === element.userId &&
            x.weekOfYear === element.weekOfYear &&
            x.year === element.year &&
            x.classroomProgrammeId === element.classroomProgrammeId &&
            x.attendanceDate === element.attendanceDate
        );
        if (existingIndex >= 0) {
          state.attendance[existingIndex] = element;
        } else {
          state.attendance.push(element);
        }
      }
    });
    builder.addCase(getMonthlyAttendanceReport.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      state.monthlyAttendanceRecordsByUser[action.meta.arg.userId] = {
        data: action.payload,
        dateRefreshed: new Date().toDateString(),
      };
    });
  },
});

const { reducer: attendanceReducer, actions: attendanceActions } =
  attendanceSlice;

const attendancePersistConfig = {
  key: 'attendance',
  storage: localForage,
  blacklist: [],
};

export { attendancePersistConfig, attendanceReducer, attendanceActions };
