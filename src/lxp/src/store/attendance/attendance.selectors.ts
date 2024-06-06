import { AttendanceDto } from '@ecdlink/core';
import { isSameDay, parseISO } from 'date-fns';
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
    (attendanceReports) => attendanceReports?.data
  );

export const getClassroomAttendanceOverviewReportByPeriod = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(
    (state: RootState) =>
      state.attendanceData.classroomAttendanceOverviewReport,
    (reports) => {
      return reports?.find((report) => {
        return (
          isSameDay(
            typeof report.startDate === 'string'
              ? parseISO(report.startDate)
              : report.startDate,
            startDate
          ) &&
          isSameDay(
            typeof report.endDate === 'string'
              ? parseISO(report.endDate)
              : report.endDate,
            endDate
          )
        );
      })?.data;
    }
  );
