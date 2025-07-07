import { MonthlyAttendanceRecord } from '@ecdlink/core';

export interface ChildAttendanceReportState {
  childId: string;
  classroomGroupId: string;
  childUserId: string;
  selectedMonth: MonthlyAttendanceRecord;
}
