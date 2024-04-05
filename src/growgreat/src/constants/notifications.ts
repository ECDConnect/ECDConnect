import ROUTES from '@/routes/routes';
import { Message } from '@models/messages/messages';

interface NotificationTagConfigParams {
  [key: string]: Partial<Message>;
  AcceptAgreement: Partial<Message>;
  SeeWalkthrough: Partial<Message>;
  CompleteProfile: Partial<Message>;
  RedAlertReferralMother: Partial<Message>;
  RedAlertReferralInfant: Partial<Message>;
  DangerSignsReferral: Partial<Message>;
  GrowthIssuesReferral: Partial<Message>;
  SevereChildMuacReferral: Partial<Message>;
  ModerateChildMuacReferral: Partial<Message>;
  AddClub: Partial<Message>;
  SeeScoreBoard: Partial<Message>;
  SeePoints: Partial<Message>;
  RoadToHealthBook: Partial<Message>;
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
  RedAlertReferralMother: {
    cta: 'SeeReferralsRedAlertMother',
  },
  RedAlertReferralInfant: {
    cta: 'SeeReferralsRedAlertInfant',
  },
  DangerSignsReferral: {
    cta: 'SeeReferralsDangerSigns',
  },
  GrowthIssuesReferral: {
    cta: 'SeeReferralsGrowthIssues',
  },
  SevereChildMuacReferral: {
    cta: 'SeeReferralsChildMuac',
  },
  ModerateChildMuacReferral: {
    cta: 'SeeReferralsChildMuacM',
  },
  RoadToHealthBook: {
    cta: 'RoadToHealth',
  },
  AddClub: {
    cta: 'AddClub',
  },
  SeeScoreBoard: {
    cta: 'SeeScoreboard',
  },
  SeePoints: {
    cta: 'SeePoints',
  },
};

export const enum MessageStatusConstants {
  Amber = 'amber',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}
