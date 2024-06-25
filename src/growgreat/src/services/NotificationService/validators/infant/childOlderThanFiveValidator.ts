import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';
import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';
import { addYears, addDays } from 'date-fns';

export class ChildOlderThanFiveValidator implements NotificationValidator {
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;

  constructor(store: EnhancedStore<RootState, any>) {
    this.store = store;
    this.interval = NotificationIntervals.oneMinute;
    this.lastCheckTimestamp = 0;
  }

  getNotifications = () => {
    const state = this.store.getState();

    const { infants: infantState } = state;

    if (!infantState) return [];

    const notifications: Message[] = [];
    for (const infant of infantState.infants || []) {
      if (infant && infant.user) {
        const dateOfBirth = infant.user?.dateOfBirth as string;
        const { years: ageYears } = getAgeInYearsMonthsAndDays(dateOfBirth);

        const removalDate = addDays(new Date(dateOfBirth), 7);
        const childRemovalDate = addYears(removalDate, 5);

        if (ageYears >= 5) {
          notifications.push({
            reference: `${infant.user.id}-5years`,
            title: `${infant.user?.firstName} has turned 5 years old!`,
            message: `You can close ${
              infant.user?.firstName
            }'s folder now. If you don't close the folder, ${
              infant.user?.firstName
            } will be removed on ${childRemovalDate.toLocaleDateString(
              'en-ZA',
              {
                day: 'numeric',
                month: 'long',
              }
            )}`,
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.higher,
            viewOnDashboard: true,
            area: 'child-registration',
            icon: 'IdentificationIcon',
            color: 'primary',
            actionText: 'Visit client',
            viewType: 'Both',
            cta: 'ChildFiveYears',
            routeConfig: {
              route: `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infant?.user?.id}`,
            },
          });
        }
      }
    }

    return notifications;
  };
}
