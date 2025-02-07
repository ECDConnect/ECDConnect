import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import { ChildDto } from '@ecdlink/core';

export type ChildrenState = {
  childData: {
    children: (ChildDto & OfflineUpdate)[];
  } & OfflineCache;
  contactHistory?: CaregiverContactHistory[];
  learnersByClassroom?: { [key: string]: number };
};

export interface CaregiverContactHistory {
  id?: string;
  caregiverId: string;
  childId: string;
  dateContacted: string;
  contactReason: CaregiverContactReason;
  isOnline?: boolean;
}

export enum CaregiverContactReason {
  'WeeklyAttendance',
  'Other',
}
