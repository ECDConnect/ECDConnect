import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import { UpdateUserPermissionInputModelInput } from '@ecdlink/graphql';

export type ClassroomState = {
  classroom: (ClassroomDto & OfflineCache & OfflineUpdate) | undefined;
  classroomGroupData: {
    classroomGroups: (ClassroomGroupDto & OfflineUpdate)[];
  } & OfflineCache;
  // use this during setup process to store practitioners and their permissions
  classroomPractitioners: UpdateUserPermissionInputModelInput[];
};
