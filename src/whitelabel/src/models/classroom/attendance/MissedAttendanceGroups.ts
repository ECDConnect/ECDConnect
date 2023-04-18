import { ClassProgrammeDto, ClassroomGroupDto } from '@ecdlink/core';

export interface MissedAttendanceGroups {
  classroomGroup: ClassroomGroupDto;
  missedDay: Date;
  classProgramme: ClassProgrammeDto;
}
