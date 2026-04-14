import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import ROUTES from '@/routes/routes';
import { Message } from '@models/messages/messages';

interface NotificationTagConfigParams {
  [key: string]: Partial<Message>;
  AddedToProgramme: Partial<Message>;
  UpdateFee: Partial<Message>;
  TrackIncome: Partial<Message>;
  ProgressSummary: Partial<Message>;
  SeeClasses: Partial<Message>;
  GetFeedback: Partial<Message>;
  SeePractitioners: Partial<Message>;
  DbeRegistration: Partial<Message>;
}
export const notificationTagConfig: NotificationTagConfigParams = {
  AddedToProgramme: {
    cta: '[[EditProfile]]',
    routeConfig: {
      route: ROUTES.PRACTITIONER.PROFILE.EDIT,
    },
    viewType: 'Messages',
  },
  UpdateFee: {
    cta: '[[UpdateFee]]',
    routeConfig: {
      route: ROUTES.CLASSROOM.UPDATE_FEE,
    },
    viewType: 'Both',
  },
  FinishProgressReport: {
    cta: '[[CreateReports]]',
    routeConfig: {
      route: ROUTES.CLASSROOM.ROOT,
      params: {
        activeTabIndex: TabsItems.PROGRESS,
      },
    },
    viewType: 'Both',
  },
  TrackIncome: {
    cta: '[[StartNow]]',
  },
  ProgressSummary: {
    cta: '[[GetSummary]]',
  },
  SeeClasses: {
    cta: '[[SeeClasses]]',
  },
  GetFeedback: {
    cta: '[[ShareFeedback]]',
  },
  SeePractitioners: {
    cta: '[[SeePractitioners]]',
  },
  DbeRegistration: {
    cta: '[[DbeRegistration]]',
  },
};

export const enum MessageStatusConstants {
  Amber = 'amber',
  Blue = 'blue',
  Red = 'red',
  Green = 'green',
}
