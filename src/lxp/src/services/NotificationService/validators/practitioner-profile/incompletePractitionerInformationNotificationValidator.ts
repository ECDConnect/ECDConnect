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
     * 3. The practitioner is not a principal yet
     */

    // TODO: change conditions for when to show the page

    if (practitionerState.practitioner) {
      const hasPractitionerRole = userState?.user?.roles?.some(
        (role) => role.name === 'Practitioner'
      );

      const notRegistered = !Boolean(
        practitionerState.practitioner?.isRegistered
      );
      const addedByPrincipal =
        Boolean(practitionerState.practitioner?.principalHierarchy) &&
        !practitionerState.practitioner?.isPrincipal;

      const showNotificationForPractitionerFlow =
        hasPractitionerRole && notRegistered && addedByPrincipal;
      const showNotificationForPrincipalFlow =
        hasPractitionerRole && notRegistered && !addedByPrincipal;

      if (showNotificationForPrincipalFlow) {
        return [
          {
            reference: `practitioner-profile`,
            title: 'Tell us more about you!',
            message:
              'Share more information about who you are to make CHW Connect more useful for you.',
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.lower,
            viewOnDashboard: true,
            area: 'practitioner',
            icon: 'SwitchVerticalIcon',
            color: 'primary',
            actionText: 'Complete your profile',
            viewType: 'Hub',
            routeConfig: {
              route: ROUTES.PRINCIPAL.SETUP_PROFILE,
            },
          },
        ];
      }

      if (showNotificationForPractitionerFlow) {
        return [
          {
            reference: `practitioner-profile`,
            title: 'Tell us more about you!',
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
    }

    return [];
  };
}
