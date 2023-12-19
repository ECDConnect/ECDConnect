import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWeek, getYear } from 'date-fns';
import localForage from 'localforage';
import {
  getAttendance,
  getMonthlyAttendanceReport,
  getPreviousWeekAttendance,
} from './attendance.actions';
import { AttendanceState, TrackAttendanceModelInput } from './attendance.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: AttendanceState = {
  attendance: undefined,
  attendanceTracked: undefined,
  monthlyAttendanceRecordsByUser: {},
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

      if (action.payload.attendees) {
        const attendaceDate = new Date(action.payload.attendanceDate);
        const week = getWeek(attendaceDate);
        const year = getYear(attendaceDate);

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
            attendanceDate: action.payload.attendanceDate,
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
      state.monthlyAttendanceRecordsByUser[action.meta.arg.userId] =
        action.payload;
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
