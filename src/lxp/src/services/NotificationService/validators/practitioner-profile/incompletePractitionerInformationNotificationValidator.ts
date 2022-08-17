import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';

export class IncompletePractitionerInformationNotificationValidator
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
    const { classroomData: classroomState } = this.store.getState();
    const { user: userState } = this.store.getState();

    if (!classroomState || !userState) return [];

    /**
     * Notification is returned when
     * 1. The user is a practitioner
     * 2. The user doesn't have a classroom
     * 3. The user doesn't have a classroom ID
     */
    const isPractitioner = userState?.user?.roles?.some(
      (role) => role.name === 'Practitioner'
    );

    const showNotification =
      isPractitioner &&
      (!classroomState?.classroom || !classroomState?.classroom?.id);

    if (showNotification) {
      return [
        {
          reference: `practitioner-profile`,
          title: 'Complete your profile',
          message:
            'We suggest connecting to a wifi network to complete this process. After syncing your data, the Funda App will continue to work offline.',
          dateCreated: new Date().toISOString(),
          priority: NotificationPriority.lower,
          viewOnDashboard: true,
          area: 'practitioner',
          icon: 'SwitchVerticalIcon',
          color: 'primary',
          actionText: 'Complete your profile',
          viewType: 'Hub',
          routeConfig: {
            route: '/practitioner/profile/edit/',
          },
        },
      ];
    }

    return [];
  };
}
