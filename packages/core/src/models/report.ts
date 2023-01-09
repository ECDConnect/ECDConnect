export interface MonthlyAttendanceRecord {
  month: string;
  monthOfYear: string;
  year: string;
  percentageAttendance: number;
}

export interface ChildAttendanceReportModel {
  totalExpectedAttendance: number;
  totalActualAttendance: number;
  attendancePercentage: number;
  classGroupAttendance: ChildGroupingAttendanceReportModel[];
}

export interface ChildGroupingAttendanceReportModel {
  classroomGroupId: string;
  classroomGroupName: string;
  startDate: string;
  endDate?: string;
  expectedAttendance: number;
  actualAttendance: number;
  attendancePercentage: number;
  monthlyAttendance: ChildAttendanceMonthlyReportModel[];
}

export interface ChildAttendanceMonthlyReportModel {
  year: number;
  month: string;
  monthNumber: number;
  actualAttendance: number;
  expectedAttendance: number;
  attendancePercentage: number;
}
