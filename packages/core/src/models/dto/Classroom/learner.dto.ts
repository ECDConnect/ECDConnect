import { EntityBase } from '../entity-base';
import { UserDto } from '../Users/user.dto';
import { ClassroomGroupDto } from './classroom-group.dto';
import { ProgrammeAttendanceReasonDto } from './programme-attendance-reason.dto';

export interface LearnerDto extends EntityBase {
  userId: string;
  user?: UserDto;
  classroomGroupId: string;
  classroomGroup?: ClassroomGroupDto;
  reasonForAttendance?: ProgrammeAttendanceReasonDto;
  attendanceReasonId?: string;
  otherAttendanceReason?: string;
  startedAttendance: Date | string;
  stoppedAttendance: Date | string | null;
}
