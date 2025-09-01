export const enum MessageStatusConstants {
  Amber = 'amber',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}

export const enum NotificationsCTAText {
  AddMeetingReport = '[[AddMeetingReport]]',
}

export type MessageRouteConfig = {
  route: string;
  params?: any;
};

export interface MessageActionConfig {
  buttonName: string;
  buttonIcon?: string;
  url: string;
  state?: any;
}
