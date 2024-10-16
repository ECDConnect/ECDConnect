import { UserAlertListDataItem } from '@ecdlink/ui';

export type ListDataItem = UserAlertListDataItem<{
  userId: string;
  firstName: string;
  surname: string;
  userRole: string;
  profileImage: string;
}>;
