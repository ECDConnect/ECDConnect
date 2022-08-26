import {
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
  LearnerDto,
  PractitionerDto,
} from '@ecdlink/core';

export type ClassroomState = {
  classroom: ClassroomDto | undefined;
  classroomGroups: ClassroomGroupDto[] | undefined;
  classroomProgrammes: ClassProgrammeDto[] | undefined;
  classroomGroupLearners: LearnerDto[] | undefined;
  programmeType: string | undefined; //TODO Fix this
  principal: PractitionerDto | undefined;
};

export type ClassroomUpdateParams = {
  classroom: ClassroomDto;
};
