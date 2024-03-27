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
    const { healthCareWorker: practitionerState } = this.store.getState();
    /**
     * Notification is returned when
     * 1. The user is a practitioner
     * 2. The practitioner object is in the state
     * 3. The practitioner is not a principal yet
     */

    if (practitionerState.healthCareWorker) {
      const notRegistered = !Boolean(
        practitionerState.healthCareWorker?.isRegistered
      );

      if (notRegistered || !practitionerState.healthCareWorker.languageId) {
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
            cta: 'CompleteProfile',
            viewType: 'Hub',
            routeConfig: {
              route: ROUTES.HEALTH_CAREWORKER_PROFILE_SETUP,
            },
          },
        ];
      }
    }

    return [];
  };
}
