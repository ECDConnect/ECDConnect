import { Message } from '@models/messages/messages';

export const enum NotificationPriority {
  lowest = 1,
  lower = 2,
  low = 3,
  average = 4,
  high = 5,
  higher = 6,
  highest = 7,
}

export enum NotificationIntervals {
  halfhour = 60000,
  hour = 60000,
  twoHours = 60000,
  fourHours = 60000,
  eightHours = 60000,
}

export interface NotificationValidator {
  interval: NotificationIntervals; // enum;
  lastCheckTimestamp: number;
  getNotifications: () => Message[] | Promise<Message[] | undefined>;
}
