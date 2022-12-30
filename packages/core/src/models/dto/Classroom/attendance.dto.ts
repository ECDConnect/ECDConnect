import { UserDto } from '../Users/user.dto';
import { ClassProgrammeDto } from './class-programme.dto';

export interface AttendanceDto {
  classroomProgrammeId?: string;
  classroomProgramme?: ClassProgrammeDto;
  user?: UserDto;
  userId?: string;
  parentRecordId?: string;
  weekOfYear?: number;
  monthOfYear?: number;
  year?: number;
  attended?: boolean;
  attendanceDate?: Date | string;
}
