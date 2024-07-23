import { AttendanceListDataItem, ComponentBaseProps } from '@ecdlink/ui';
import { AttendanceResult } from '@models/classroom/attendance/AttendanceResult';

export interface AttendanceState {
  list: AttendanceListDataItem[];
  cacheId: string;
  isRequired: boolean;
}

export interface AttendanceStateCheckResult {
  isValid: boolean;
  presentCount: number;
  absentCount: number;
}

export interface AttendanceListProps extends ComponentBaseProps {
  attendanceDate?: Date;
  onSubmitSuccess: (attendanceSuccessList: AttendanceResult) => void;
  editAttendanceRegisterVisible?: boolean;
  classroomGroupId?: string;
}
