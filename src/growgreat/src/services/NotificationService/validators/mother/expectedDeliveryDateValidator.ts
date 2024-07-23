import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';

export class ExpectedDeliveryDateValidator implements NotificationValidator {
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

    const { mothers: motherState } = state;

    if (!motherState) return [];

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setHours(threeDaysFromNow.getHours() + 72);

    const notifications: Message[] = [];
    for (const mother of motherState.mothers || []) {
      if (mother && mother.expectedDateOfDelivery) {
        const expectedDateOfDelivery = new Date(mother.expectedDateOfDelivery);
        const threeDaysAfterEdd = new Date(expectedDateOfDelivery);
        threeDaysAfterEdd.setHours(threeDaysAfterEdd.getHours() + 72);

        if (
          expectedDateOfDelivery.getTime() < threeDaysFromNow.getTime() &&
          new Date().getTime() <= threeDaysAfterEdd.getTime()
        ) {
          notifications.push({
            reference: `${mother.userId}-edd`,
            title: `${mother.user?.firstName}'s expected delivery date is approaching!`,
            message: `Expected delivery date - ${expectedDateOfDelivery.toLocaleDateString(
              'en-ZA',
              {
                day: 'numeric',
                month: 'long',
              }
            )}. Most mothers are discharged the same day they deliver their baby. Visit as soon as possible after the baby is born. This is a really critical time and mothers and babies are very vulnerable. Your ongoing support and encouragement is powerful!`,
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.higher,
            viewOnDashboard: true,
            area: 'mothers',
            icon: 'IdentificationIcon',
            color: 'primary',
            actionText: `Visit ${mother.user?.firstName}`,
            viewType: 'Messages',
            cta: 'ExpectedDeliveryDate',
            routeConfig: {
              route: `${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${mother?.user?.id}`,
            },
          });
        }
      }
    }

    return notifications;
  };
}
