import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';

export class IncompleteCoachInformationNotificationValidator
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

  getNotifications = (): Message[] => {
    const { user: userState } = this.store.getState();

    if (!userState) return [];

    /**
     * Notification is returned when
     * 1. The user is a coach
     * 2. The user doesn't have a firstName
     * 3. The user doesn't have a surname
     * 4. The user doesn't have a phoneNumber
     */
    const isCoach = userState?.user?.roles?.some(
      (role) => role.name === 'Coach'
    );

    const showNotification =
      isCoach &&
      (!userState?.user?.firstName ||
        !userState?.user?.surname ||
        !userState?.user?.email);

    if (showNotification) {
      return [
        {
          reference: `coach-profile`,
          title: 'Complete your Profile',
          message: 'Share more information to make Funda App useful for you.',
          dateCreated: new Date().toISOString(),
          priority: NotificationPriority.lower,
          viewOnDashboard: true,
          area: 'coach',
          icon: 'SwitchVerticalIcon',
          color: 'primary',
          actionText: 'Complete your profile',
          viewType: 'Hub',
          routeConfig: {
            route: '/coach/profile/edit/',
          },
        },
      ];
    }

    return [];
  };
}
