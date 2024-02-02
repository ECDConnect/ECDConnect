import { AttendanceDto, MonthlyAttendanceRecord } from '@ecdlink/core';

export type AttendanceState = {
  attendance: AttendanceDto[] | undefined;
  attendanceTracked: TrackAttendanceModelInput[] | undefined;

  monthlyAttendanceRecordsByUser: {
    [userId: string]: MonthlyAttendanceRecord[];
  };
};

export type AttendanceQueryParams = {
  year: number;
  monthOfYear: number;
  weekOfYear: number;
};

export type ChildAttendanceReportQueryParams = {
  classgroupId: string;
  startDate: Date;
  endDate: Date;
};

export type MonthlyAttendanceReportQueryParams = {
  userId: string;
  classroomId: string;
  startDate: Date;
  endDate: Date;
};

export type TrackAttendanceModelInput = {
  classroomProgrammeId: string;
  programmeOwnerId?: string;
  attendees?: ChildAttendance[];
  attendanceDate: Date | string;
};

export interface ChildAttendance {
  userId: string;
  attended: boolean;
}
