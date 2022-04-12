import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWeek, getYear } from 'date-fns';
import localForage from 'localforage';
import { getAttendance } from './attendance.actions';
import { AttendanceState, TrackAttendanceModelInput } from './attendance.types';

const initialState: AttendanceState = {
  attendance: undefined,
  attendanceTracked: undefined,
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
    builder.addCase(getAttendance.fulfilled, (state, action) => {
      state.attendance = action.payload;
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
