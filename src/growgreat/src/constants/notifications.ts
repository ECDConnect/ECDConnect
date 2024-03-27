import ROUTES from '@/routes/routes';
import { Message } from '@models/messages/messages';

interface NotificationTagConfigParams {
  [key: string]: Partial<Message>;
  AcceptAgreement: Partial<Message>;
  SeeWalkthrough: Partial<Message>;
  CompleteProfile: Partial<Message>;
  RedAlertReferral: Partial<Message>;
  DangerSignsReferral: Partial<Message>;
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
  RedAlertReferral: {
    cta: 'SeeReferralsRedAlert',
  },
  DangerSignsReferral: {
    cta: 'SeeReferralsDangerSigns',
  },
};

export const enum MessageStatusConstants {
  Amber = 'amber',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}
