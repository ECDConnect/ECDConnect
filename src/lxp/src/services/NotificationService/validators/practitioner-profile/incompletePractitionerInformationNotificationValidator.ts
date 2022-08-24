import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';

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
    const {
      user: userState,
      classroomData: classroomState,
      practitioner: practitionerState,
    } = this.store.getState();

    if (!classroomState || !userState) return [];

    /**
     * Notification is returned when
     * 1. The user is a practitioner
     * 2. The practitioner object is in the state
     */

    // TODO: change conditions for when to show the page
    const isPractitioner =
      userState?.user?.roles?.some((role) => role.name === 'Practitioner') &&
      Boolean(practitionerState?.practitioner?.isPrincipal) === false;

    const showNotification =
      isPractitioner && !Boolean(practitionerState.practitioner?.siteAddress);

    if (showNotification) {
      return [
        {
          reference: `practitioner-profile`,
          title: 'Complete your profile',
          message:
            'Share more information about your programme to make Funda App useful for you.',
          dateCreated: new Date().toISOString(),
          priority: NotificationPriority.lower,
          viewOnDashboard: true,
          area: 'practitioner',
          icon: 'SwitchVerticalIcon',
          color: 'primary',
          actionText: 'Complete your profile',
          viewType: 'Hub',
          routeConfig: {
            route: ROUTES.PRACTITIONER.PROFILE.EDIT,
          },
        },
      ];
    }

    return [];
  };
}
