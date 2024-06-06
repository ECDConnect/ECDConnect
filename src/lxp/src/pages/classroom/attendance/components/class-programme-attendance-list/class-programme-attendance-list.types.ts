import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import {
  AttendanceListDataItem,
  AttendanceStatus,
  ComponentBaseProps,
} from '@ecdlink/ui';

export interface ClassProgrammeAttendanceListProps extends ComponentBaseProps {
  isPrimaryClass: boolean;
  classroomGroup: ClassroomGroupDto;
  attendanceDate: Date;
  onAttendanceUpdated: (state: AttendanceListState) => void;
  isMultipleClasses: boolean;
  initialAttendanceList?: { childUserId: string; status: AttendanceStatus }[];
}

export interface AttendanceListState {
  listItems: AttendanceListDataItem[];
}
