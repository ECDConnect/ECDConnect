import {
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
  LearnerDto,
} from '@ecdlink/core';

export type ClassroomState = {
  classroom: ClassroomDto | undefined;
  classroomGroups: ClassroomGroupDto[] | undefined;
  classroomProgrammes: ClassProgrammeDto[] | undefined;
  classroomGroupLearners: LearnerDto[] | undefined;
  programmeType: string | undefined; //TODO Fix this
};

export type ClassroomUpdateParams = {
  classroom: ClassroomDto;
};
