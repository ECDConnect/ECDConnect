import { CaregiverClients } from '@ecdlink/graphql';
import { CaregiverDto } from '@ecdlink/core';

export interface CaregiverClientsState {
  caregiverId: string;
  clients: CaregiverClients;
}

export interface CaregiverState {
  caregivers?: CaregiverDto[];
  contactHistory?: CaregiverContactHistory[];
  caregiverClientsList?: CaregiverClientsState[];
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
