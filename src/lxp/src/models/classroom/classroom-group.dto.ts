import { ClassProgrammeDto } from '@ecdlink/core';
import { OfflineUpdate } from '../sync/offline-update';

export type ClassroomGroupDto = {
  id: string;
  classroomId: string;
  name: string;
  userId: string; // This would be the practitioner running the classroom group
  learners: LearnerDto[];
  classProgrammes: (ClassProgrammeDto & OfflineUpdate)[];
  meetEveryday?: boolean | undefined;
};

export type LearnerDto = OfflineUpdate & {
  learnerId: string;
  childUserId: string;
  startedAttendance: Date | string;
  isActive: boolean;
  stoppedAttendance: Date | string | null;
  userId: string;
  classroomGroupId: string;
};
