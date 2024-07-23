import { ComponentBaseProps } from '@ecdlink/ui';
import { AttendanceResult } from '@models/classroom/attendance/AttendanceResult';

export interface EditAttendanceRegisterProps extends ComponentBaseProps {
  attendanceDate: Date;
  onBack: () => void;
  editAttendanceRegisterVisible?: boolean;
  classroomName: string;
  classroomGroupId: string;
}
