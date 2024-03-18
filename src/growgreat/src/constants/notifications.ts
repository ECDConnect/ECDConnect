import ROUTES from '@/routes/routes';
import { Message } from '@models/messages/messages';

interface NotificationTagConfigParams {
  [key: string]: Partial<Message>;
  AcceptAgreement: Partial<Message>;
}
export const notificationTagConfig: NotificationTagConfigParams = {
  AcceptAgreement: {
    routeConfig: {
      route: ROUTES.DASHBOARD,
    },
    viewType: 'Both',
  },
  SeeWalkthrough: {
    cta: 'SeeWalkthrough',
  },
  CompleteProfile: {
    cta: 'CompleteProfile',
  },
};

export const enum MessageStatusConstants {
  Amber = 'amber',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}
