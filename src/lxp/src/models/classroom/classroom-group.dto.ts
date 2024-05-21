import { OfflineUpdate } from '../sync/offline-update';

export type ClassroomGroupDto = {
  id: string;
  classroomId: string;
  name: string;
  userId: string; // This would be the practitioner running the classroom group
  learners: LearnerDto[];
};

export type LearnerDto = OfflineUpdate & {
  learnerId: string;
  childUserId: string;
  startedAttendance: string;
  isActive: boolean;
  stoppedAttendance: string | undefined;
};
