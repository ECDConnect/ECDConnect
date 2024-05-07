import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';

export class InfantDocumentsNotificationValidator
  implements NotificationValidator
{
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;

  constructor(store: EnhancedStore<RootState, any>) {
    this.store = store;
    this.interval = NotificationIntervals.hour;
    this.lastCheckTimestamp = 0;
  }

  getNotifications = () => {
    const state = this.store.getState();

    const {
      documents: documentsState,
      infants: infantState,
      staticData: staticDataState,
    } = state;

    if (!documentsState || !infantState || !staticDataState) return [];

    const notifications: Message[] = [];
    for (const infant of infantState.infants || []) {
      if (infant && infant.userId && infant.user) {
        const documents = (documentsState.documentsForHCW || []).filter(
          (doc) => doc.userId === infant.userId
        );

        if (!documents || documents.length === 0) {
          notifications.push({
            reference: `${infant.userId}-docs`,
            title: `Upload ${infant.user?.firstName}'s Road to Health Book`,
            message: `Add a picture of page ii of ${infant.user?.firstName}'s Road to Health Book. Refer ${infant.caregiver?.firstName} to the clinic if they do not have
          ${infant.user?.firstName}'s document.`,
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.higher,
            viewOnDashboard: true,
            area: 'child-registration',
            icon: 'IdentificationIcon',
            color: 'primary',
            actionText: 'Upload image of RTH',
            viewType: 'Both',
            cta: 'RoadToHealth',
            routeConfig: {
              route: `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infant?.user?.id}`,
              params: {
                isRoadToHealthBook: true,
              },
            },
          });
        }
      }
    }

    return notifications;
  };
}
