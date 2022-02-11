import { ComponentBaseProps } from '@ecdlink/ui';
import { AttendanceResult } from '../../../../../models/classroom/attendance/AttendanceResult';

export interface EditAttendanceRegisterProps extends ComponentBaseProps {
  attendanceDate: Date;
  submitText?: string;
  onComplete: (attendanceSuccessList: AttendanceResult) => void;
  onBack: () => void;
}
