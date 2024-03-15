import { UserAlertListDataItem } from '@ecdlink/ui';

export type ParticipantType =
  | 'mother'
  | 'clinic'
  | 'teamLead'
  | 'healthCareWorker';

export type ListDataItem = UserAlertListDataItem<{
  firstName: string;
  surname: string;
  type: ParticipantType;
}>;
