import { Message } from '@models/messages/messages';

export interface NotificationsState {
  notifications: Notification[];
  notificationReferences: string[];
}

export interface Notification {
  isNew: boolean;
  message: Message;
}
