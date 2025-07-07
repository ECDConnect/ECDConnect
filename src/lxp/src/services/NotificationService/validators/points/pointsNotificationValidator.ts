import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { EnhancedStore } from '@reduxjs/toolkit';
import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  getDate,
  lastDayOfMonth,
} from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationValidator,
  NotificationIntervals,
  NotificationPriority,
} from '../../NotificationService.types';
import { RoleSystemNameEnum } from '@ecdlink/core';
import { DateFormats } from '@/constants/Dates';
import ROUTES from '@/routes/routes';
import { pointsConstants } from '@/constants/points';
import { referenceNames } from './poinstNotificationValidator.types';

export class PointsNotificationValidator implements NotificationValidator {
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;
  currentDate: Date;
  constructor(store: EnhancedStore<RootState, any>, currentDate: Date) {
    this.store = store;
    this.interval = NotificationIntervals.hour;
    this.lastCheckTimestamp = 0;
    this.currentDate = currentDate;
  }

  getNotifications = (): Message[] => {
    const {
      points: pointsState,
      user: userState,
      practitioner: practitionerState,
      tenant: tenantState,
    } = this.store.getState();

    const isCoach = userState?.user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    );

    if (isCoach) return [];

    const notifications: Message[] = [];
    const lastDayOfMonthDate = lastDayOfMonth(new Date());
    const today = new Date();
    const lessThen10Days = differenceInDays(lastDayOfMonthDate, today);
    const currentYear = new Date().getFullYear();

    const firstDecDayDate = new Date(currentYear, 11, 1);
    const yearpointsTotal = pointsState.yearPoints?.total;

    if (
      (practitionerState?.practitioner?.isPrincipal &&
        pointsState?.shareData?.total! <
          pointsConstants.principalOrAdminMonthlyMax &&
        lessThen10Days <= 10) ||
      (!practitionerState?.practitioner?.isPrincipal &&
        pointsState?.shareData?.total! <
          pointsConstants.practitionerMonthlyMax &&
        lessThen10Days <= 10)
    ) {
      // EC-3687 hide notification for now
      // notifications.push({
      //   reference: referenceNames.points10DaysBeforeLastDayOfMonth,
      //   title: `Less than 2 weeks to earn points!`,
      //   message: `More and more practitioners on ${tenantState?.tenant?.applicationName} are earning points. Start earning points to join them!`,
      //   dateCreated: new Date().toISOString(),
      //   priority: 36,
      //   viewOnDashboard: true,
      //   area: 'points',
      //   icon: 'SwitchVerticalIcon',
      //   color: 'primary',
      //   viewType: 'Both',
      //   actionText: 'Learn more',
      //   routeConfig: {
      //     route: ROUTES.PRACTITIONER.POINTS.SUMMARY,
      //   },
      // });
    } else if (
      today === firstDecDayDate &&
      yearpointsTotal &&
      yearpointsTotal > 0
    ) {
      notifications.push({
        reference: referenceNames?.yearPointsGreaterThen0,
        title: `Wow, well done for a successful year!`,
        message: `See your ${currentYear} points summary.`,
        dateCreated: new Date().toISOString(),
        expiryDate: addDays(new Date(), 10).toISOString(),
        priority: 37,
        viewOnDashboard: true,
        isFromBackend: false,
        area: 'points',
        icon: 'SwitchVerticalIcon',
        color: 'primary',
        viewType: 'Both',
        actionText: 'See summary',
        routeConfig: {
          route: ROUTES.PRACTITIONER.POINTS.YEAR,
        },
      });
    } else {
      return [];
    }

    return notifications;
  };
}
