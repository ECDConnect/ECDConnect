import { AttendanceDto } from '@ecdlink/core';

export type AttendanceState = {
  attendance: AttendanceDto[] | undefined;
  attendanceTracked: TrackAttendanceModelInput[] | undefined;
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

// export type Attendance = {
//   classProgrammeId?: number;
//   classProgrammeCacheId: string;
//   userId?: string;
//   userId?: string;
//   weekOfYear?: number;
//   year?: number;
//   attended?: boolean;
//   attendanceDate?: Date | string;
// };

export interface ChildAttendance {
  userId: string;
  attended: boolean;
}
