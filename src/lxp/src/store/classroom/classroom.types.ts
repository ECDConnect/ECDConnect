import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import {
  ClassroomDto as FullClassroomDto,
  ClassProgrammeDto,
  LearnerDto,
  PrincipalDto,
} from '@ecdlink/core';

export type ClassroomState = {
  classroom: ClassroomDto | undefined;
  classroomGroups: ClassroomGroupDto[] | undefined;
  classroomProgrammes: ClassProgrammeDto[] | undefined; // Still need to update this

  // I don't think we need any of this, should probably remove
  classroomGroupLearners: LearnerDto[] | undefined;
  programmeType: string | undefined; //TODO Fix this
  principal: PrincipalDto | undefined;
  classrooGroupsForPractitioner: any | undefined;
};

export type ClassroomUpdateParams = {
  classroom: FullClassroomDto;
};
