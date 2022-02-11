export interface Attendance {
  classProgrammeCacheId: string;
  userCacheId: string;
  weekOfYear?: number;
  year?: number;
  attended?: boolean;
  attendanceDate?: Date | string;
}
