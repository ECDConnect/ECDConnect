import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassProgrammeDto, LearnerDto } from '@ecdlink/core';

export type ClassroomForCoachState = {
  classroomForCoach: ClassroomDto[] | undefined;
  classroomGroups: ClassroomGroupDto[] | undefined;
  classroomProgrammes: ClassProgrammeDto[] | undefined;
  classroomGroupLearners: LearnerDto[] | undefined; // This should probably be removed
};

export type ClassroomUpdateParams = {
  classroom: ClassroomDto;
};
