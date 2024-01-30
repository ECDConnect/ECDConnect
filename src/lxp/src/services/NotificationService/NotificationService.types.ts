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
  oneMinute = 60000,
  halfhour = 1800000,
  hour = 3600000,
  twoHours = 3600000 * 2,
  fourHours = 3600000 * 4,
  eightHours = 3600000 * 8,
  oneDay = 3600000 * 24,
}

export interface NotificationValidator {
  interval: NotificationIntervals; // enum;
  lastCheckTimestamp: number;
  getNotifications: () => Message[] | Promise<Message[] | undefined>;
}
