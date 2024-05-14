import { ClassProgrammeDto } from '@ecdlink/core';
import { ClassroomGroupDto } from '../classroom-group.dto';

export interface MissedAttendanceGroups {
  classroomGroup: ClassroomGroupDto;
  missedDay: Date;
  classProgramme: ClassProgrammeDto;
}
