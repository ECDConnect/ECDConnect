import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import { VisitDto } from '@ecdlink/core';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import { addDays } from 'date-fns';
import ROUTES from '@/routes/routes';

export class VisitsNotCompletedNotificationValidator
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
    const { visits: visitData, user: userData } = this.store.getState();

    const userCreated = new Date(userData?.user?.insertedDate || new Date());
    const twoWeeksAgo = addDays(new Date(), -14);
    const lastCompletedVisit =
      new Date(visitData?.visitStatus?.lastCompletedVisit!) || undefined;

    if (userCreated.getTime() < twoWeeksAgo.getTime()) {
      if (
        lastCompletedVisit === undefined ||
        lastCompletedVisit.getTime() < twoWeeksAgo.getTime()
      ) {
        return [
          {
            reference: `healthcareworker-visits`,
            title: 'Visit your clients every week',
            message:
              'Other CHWs visit clients every week - join them and visit your clients often!',
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.higher,
            viewOnDashboard: true,
            area: 'practitioner',
            icon: 'SwitchVerticalIcon',
            color: 'primary',
            actionText: 'Visit clients',
            cta: 'VisitClients',
            viewType: 'Both',
            routeConfig: {
              route: ROUTES.CLIENTS.ROOT,
            },
          },
        ];
      }
    }

    return [];
  };
}
