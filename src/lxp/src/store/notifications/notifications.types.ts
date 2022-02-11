import { Message } from '../../models/messages/messages';

export interface NotificationsState {
  notifications: Notification[];
}

export interface Notification {
  isNew: boolean;
  message: Message;
}
