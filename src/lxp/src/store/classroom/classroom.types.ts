import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import { ClassProgrammeDto } from '@ecdlink/core';

export type ClassroomState = {
  classroom: (ClassroomDto & OfflineCache & OfflineUpdate) | undefined;
  classroomGroupData: {
    classroomGroups: (ClassroomGroupDto & OfflineUpdate)[];
  } & OfflineCache;
  classroomProgrammes: ClassProgrammeDto[] | undefined; // Still need to update this
};
