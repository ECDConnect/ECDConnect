import { ChildDto } from '@ecdlink/core';

export type ChildrenState = {
  children: ChildDto[] | undefined;
  contactHistory?: CaregiverContactHistory[];
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
