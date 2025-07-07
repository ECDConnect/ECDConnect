import { AttendanceListDataItem } from '@ecdlink/ui';

export interface ClassAttendance {
  classProgrammeId: number;
  classProgrammeName: string;
  attendanceList: AttendanceListDataItem[];
}
export const goodScoreThreshold = 80;
export const averageScoreThreshold = 51;
export const badScoreThreshold = 50;
