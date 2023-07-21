import { CaregiverDto } from '@ecdlink/core';

export interface CaregiverState {
  caregivers?: CaregiverDto[];
  contactHistory?: CaregiverContactHistory[];
}

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
