import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import {
  AttendanceDto,
  ClassRoomChildAttendanceMonthlyReportModel,
  MonthlyAttendanceRecord,
} from '@ecdlink/core';

export type AttendanceState = {
  attendance: AttendanceDto[] | undefined;
  attendanceTracked:
    | (TrackAttendanceModelInput & Partial<OfflineUpdate>)[]
    | undefined;

  monthlyAttendanceRecordsByUser: {
    [userId: string]: { data: MonthlyAttendanceRecord[] } & OfflineCache;
  };
  // TODO: not sure if it's necessary to split by user
  classroomAttendanceOverviewReport: ({
    startDate: string;
    endDate: string;
    data: ClassRoomChildAttendanceMonthlyReportModel;
  } & OfflineCache)[];
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
