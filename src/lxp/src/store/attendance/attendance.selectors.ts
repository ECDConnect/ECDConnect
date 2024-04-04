import { AttendanceDto } from '@ecdlink/core';
import { isSameDay } from 'date-fns';
import { createSelector } from 'reselect';
import { RootState } from '../types';
import { TrackAttendanceModelInput } from './attendance.types';

export const getAttendance = (state: RootState): AttendanceDto[] | undefined =>
  state.attendanceData.attendance;

export const getTrackedAttendance = (
  state: RootState
): TrackAttendanceModelInput[] | undefined =>
  state.attendanceData.attendanceTracked;

export const getClassroomProgrammeAttendanceFor = (attendanceDate: Date) =>
  createSelector(
    (state: RootState) => state.attendanceData.attendance || [],
    (attendance: AttendanceDto[]) =>
      attendance.filter((att) =>
        isSameDay(new Date(att.attendanceDate as string), attendanceDate)
      )
  );

export const getAttendanceReportsForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.attendanceData.monthlyAttendanceRecordsByUser[userId],
    (attendanceReports) => attendanceReports
  );
