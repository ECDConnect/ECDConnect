import { EntityCacheBase } from './entity-cache-base';

export interface Learner extends EntityCacheBase {
  attendanceReasonId?: number;
  otherAttendanceReason: string;
  startedAttendance: Date | string;
  stoppedAttendance?: Date | string;
  userId?: string;
}
