import { UserAlertListDataItem } from '@ecdlink/ui';

export type EventType = 'Home visit' | 'Breastfeeding club' | 'Other';

export type ParticipantType =
  | 'infant'
  | 'mother'
  | 'clinic'
  | 'teamLead'
  | 'healthCareWorker';

export type ListDataItem = UserAlertListDataItem<{
  firstName: string;
  surname: string;
  type: ParticipantType;
}>;
