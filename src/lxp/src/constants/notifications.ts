import ROUTES from '@/routes/routes';
import { Message } from '@models/messages/messages';

interface NotificationTagConfigParams {
  [key: string]: Partial<Message>;
  AcceptAgreement: Partial<Message>;
  GetStartedTrainee: Partial<Message>;
  StartJourney: Partial<Message>;
  AddedToProgramme: Partial<Message>;
  SayHello: Partial<Message>;
}
export const notificationTagConfig: NotificationTagConfigParams = {
  AcceptAgreement: {
    cta: 'AcceptAgreement',
    routeConfig: {
      route: ROUTES.PRACTITIONER.COMMUNITY.ACCEPT_CLUB_LEADER_ROLE,
    },
    viewType: 'Both',
  },
  GetStartedTrainee: {
    cta: 'GetStartedTrainee',
    routeConfig: {
      route: ROUTES.TRAINEE.TRAINEE_ONBOARDING,
    },
    viewType: 'Both',
  },
  StartJourney: {
    cta: 'StartJourney',
    routeConfig: {
      route: ROUTES.TRAINEE.TRAINEE_ONBOARDING,
    },
    viewType: 'Both',
  },
  AddedToProgramme: {
    cta: '[[EditProfile]]',
    routeConfig: {
      route: ROUTES.PRACTITIONER.PROFILE.EDIT,
    },
    viewType: 'Messages',
  },
  SayHello: {
    cta: '[[SayHello]]',
    routeConfig: {
      route: ROUTES.PRACTITIONER.COMMUNITY.WELCOME,
    },
    viewType: 'Both',
  },
};

export const enum MessageStatusConstants {
  Amber = 'amber',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}
