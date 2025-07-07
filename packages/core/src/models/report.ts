export interface MonthlyAttendanceRecord {
  month: string;
  monthOfYear: string;
  year: string;
  percentageAttendance: number;
  numberOfSessions: number;
  totalScheduledSessions: number;
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

export interface ChildAttendanceOverallReportModel {
  totalActualAttendance: number;
  totalExpectedAttendance: number;
  attendancePercentage: number;
  classgroupId: string;
  childFullName: string;
  childUserId: string;
  month: number;
  year: number;
  attendance: {
    key: number;
    value: number;
  }[];
}

export interface ClassRoomChildAttendanceMonthlyReportModel {
  totalExpectedAttendance: number;
  attendancePercentage: number;
  classgroupId: string;
  childFullName: string;
  childIdNumber: string;
  childUserId: string;
  month: number;
  year: number;
  classroomAttendanceReport: ChildAttendanceOverallReportModel[];
  totalAttendance: {
    key: number;
    value: number;
  }[];
  totalAttendanceStatsReport: {
    totalSessions: number;
    totalMonthlyAttendance: number;
    totalChildrenAttendedAllSessions: number;
  };
}
