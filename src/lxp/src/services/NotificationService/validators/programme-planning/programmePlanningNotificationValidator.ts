import { EnhancedStore } from '@reduxjs/toolkit';
import {
  differenceInMonths,
  getMonth,
  getYear,
  isAfter,
  isBefore,
} from 'date-fns';
import { DateFormats } from '../../../../constants/Dates';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';

export class ProgrammePlanningNotificationValidator
  implements NotificationValidator
{
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
    const { programmeData: programmeState, user: userState } =
      this.store.getState();

    if (!programmeState || !programmeState.programmes || !userState) return [];

    const dateUserCreated = userState.user?.insertedDate
      ? new Date(userState.user?.insertedDate)
      : this.currentDate;

    const monthsSinceUserRegistered = Math.abs(
      differenceInMonths(dateUserCreated, this.currentDate)
    );

    if (monthsSinceUserRegistered <= 0) return [];

    let lastPlannedDateText = '';

    const programmesEndingBeforeCurrentDate = (programmeState.programmes || [])
      .filter((p) => isBefore(new Date(p.endDate), this.currentDate))
      .sort((a, b) =>
        isAfter(new Date(a.endDate), new Date(b.endDate)) ? 1 : -1
      );

    if (programmesEndingBeforeCurrentDate.length > 0) {
      const lastPlannedDate = new Date(
        programmesEndingBeforeCurrentDate[0].endDate
      );

      const monthsSinceLastPlannedDate = Math.abs(
        differenceInMonths(this.currentDate, lastPlannedDate)
      );

      if (monthsSinceLastPlannedDate === 0) return [];

      lastPlannedDateText = lastPlannedDate.toLocaleString(
        'en-za',
        DateFormats.dayWithShortMonthName
      );
    }

    const programmesStartingAfterCurrentDate = (programmeState.programmes || [])
      .filter((p) => isAfter(new Date(p.startDate), this.currentDate))
      .sort((a, b) =>
        isAfter(new Date(a.startDate), new Date(b.startDate)) ? -1 : 1
      );

    if (programmesStartingAfterCurrentDate.length > 0) {
      const nextPlannedDate = programmesStartingAfterCurrentDate.reduce(
        (prev, curr) => {
          const programmeDate = new Date(curr.startDate);

          if (!prev || isAfter(programmeDate, prev)) {
            return programmeDate;
          }

          return prev;
        },
        new Date()
      );

      const monthsUntilNextPlannedDate = Math.abs(
        differenceInMonths(nextPlannedDate, this.currentDate)
      );

      if (monthsUntilNextPlannedDate === 0) return [];
    }

    return [
      {
        reference: `no-programmes-planned-${getMonth(
          this.currentDate
        )}-${getYear(this.currentDate)}`,
        title: `No programmes planned since ${
          lastPlannedDateText || 'a while'
        }`,
        message:
          'Plan your daily routines every week to get 25 SmartStart points.',
        actionText: 'Plan your programmes',
        area: 'programme-planning',
        color: 'primary',
        dateCreated: new Date().toISOString(),
        icon: 'ExclamationCircleIcon',
        priority: NotificationPriority.highest,
        viewType: 'Hub',
        viewOnDashboard: true,
        isFromBackend: false,
        routeConfig: {
          route: '/programmes/theme',
        },
      },
    ];
  };
}
