import { ClassProgrammeDto } from '@ecdlink/core';
import { ClassroomGroupDto } from '../classroom-group.dto';

export interface ClassProgrammeWithMissedDate extends ClassProgrammeDto {
  missedDate: Date;
}
export interface MissedAttendanceGroups {
  classroomGroup: ClassroomGroupDto;
  missedDay: Date;
  classProgramme: ClassProgrammeWithMissedDate;
}
