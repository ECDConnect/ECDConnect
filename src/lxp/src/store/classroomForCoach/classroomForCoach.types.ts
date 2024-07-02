import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassProgrammeDto, LearnerDto } from '@ecdlink/core';
import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';

export type ClassroomForCoachState = {
  classroomForCoach: ClassroomDto[] | undefined;
  classroomGroupData: {
    classroomGroups: (ClassroomGroupDto & OfflineUpdate)[];
  } & OfflineCache;
  classroomProgrammes: ClassProgrammeDto[] | undefined;
  classroomGroupLearners: LearnerDto[] | undefined; // This should probably be removed
};

export type ClassroomUpdateParams = {
  classroom: ClassroomDto;
};
