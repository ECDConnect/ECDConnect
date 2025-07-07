import { MonthlyAttendanceRecord } from '@ecdlink/core';

export interface EditRegistersRouteState {
  startDate: Date;
  endDate: Date;
  selectedMonth: MonthlyAttendanceRecord;
}
