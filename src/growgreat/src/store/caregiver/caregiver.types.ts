import { Caregiver, CaregiverClients } from '@ecdlink/graphql';
import { CaregiverDto } from '@ecdlink/core';

export type MergedCaregiver = Caregiver & CaregiverClients;

export interface CaregiverState {
  caregivers?: CaregiverDto[];
  contactHistory?: CaregiverContactHistory[];
  caregiverClientsList?: MergedCaregiver[];
}

export interface CaregiverContactHistory {
  id?: string;
  caregiverId: string;
  childId: string;
  dateContacted: string;
  contactReason: CaregiverContactReason;
}

export enum CaregiverContactReason {
  'WeeklyAttendance',
  'Other',
}
