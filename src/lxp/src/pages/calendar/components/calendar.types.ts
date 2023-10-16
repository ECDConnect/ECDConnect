import { UserAlertListDataItem } from '@ecdlink/ui';

export type ListDataItem = UserAlertListDataItem<{
  firstName: string;
  surname: string;
  isClub: boolean;
}>;
