import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWeek, getYear, isSameDay, parseISO } from 'date-fns';
import localForage from 'localforage';
import {
  getAttendance,
  getClassroomAttendanceReport,
  getMonthlyAttendanceReport,
  getPreviousWeekAttendance,
  trackAttendanceSync,
} from './attendance.actions';
import { AttendanceState, TrackAttendanceModelInput } from './attendance.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: AttendanceState = {
  attendance: undefined,
  attendanceTracked: undefined,
  monthlyAttendanceRecordsByUser: {},
  classroomAttendanceOverviewReport: [],
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    resetAttendanceState: (state) => {
      state.attendance = initialState.attendance;
      state.attendanceTracked = initialState.attendanceTracked;
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
        const week = getWeek(attendanceDate);
        const year = getYear(attendanceDate);

        for (const attendee of action.payload.attendees) {
          const existingIndex = state.attendance?.findIndex(
            (x) =>
              x.userId === attendee.userId &&
              x.weekOfYear === week &&
              x.year === year &&
              x.classroomProgrammeId === action.payload.classroomProgrammeId
          );

          const input = {
            classroomProgrammeId: action.payload.classroomProgrammeId,
            attendanceDate: new Date(attendanceDate.setHours(0, 0, 0, 0)),
            attended: attendee.attended,
            userId: attendee.userId,
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
    builder.addCase(getClassroomAttendanceReport.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const startDate = action.meta.arg.startDate;
      const endDate = action.meta.arg.endDate;

      const index = state.classroomAttendanceOverviewReport.findIndex(
        (item) =>
          isSameDay(parseISO(item.startDate), startDate) &&
          isSameDay(parseISO(item.endDate), endDate)
      );

      if (index === -1) {
        state.classroomAttendanceOverviewReport.push({
          startDate,
          endDate,
          data: action.payload.data,
          dateRefreshed: new Date().toDateString(),
        });
      } else {
        state.classroomAttendanceOverviewReport[index].data =
          action.payload.data;

        if (!action.payload.retrievedFromCache) {
          state.classroomAttendanceOverviewReport[index].dateRefreshed =
            new Date().toDateString();
        }
      }
    });
    setThunkActionStatus(builder, trackAttendanceSync);
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
        state.classroomAttendanceOverviewReport = [];
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
    builder.addCase(getPreviousWeekAttendance.fulfilled, (state, action) => {
      if (!state.attendance) state.attendance = [];

      for (let i = 0; i < action.payload.length; i++) {
        const existingIndex = state.attendance?.findIndex(
          (x) =>
            x.userId === action.payload[i].userId &&
            x.weekOfYear === action.payload[i].weekOfYear &&
            x.year === action.payload[i].year &&
            x.classroomProgrammeId === action.payload[i].classroomProgrammeId &&
            x.attendanceDate === action.payload[i].attendanceDate
        );
        if (existingIndex >= 0) {
          state.attendance[existingIndex] = action.payload[i];
        } else {
          state.attendance.push(action.payload[i]);
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
