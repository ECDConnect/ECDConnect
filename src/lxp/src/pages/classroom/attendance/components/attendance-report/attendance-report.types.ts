import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface AttendanceReportProps extends ComponentBaseProps {
  classroom?: ClassroomDto;
  currentClassroomGroup?: ClassroomGroupDto;
  classroomGroups?: ClassroomGroupDto[];
  isAllRegistersCompleted?: boolean;
  onTakeAttendance?: () => void;
}
