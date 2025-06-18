import { EnhancedStore } from '@reduxjs/toolkit';
import { differenceInCalendarDays, getWeek, getYear } from 'date-fns';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';

export class UserLastLoginNotificationValidator
  implements NotificationValidator
{
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;
  currentDate: Date;
  applicationName: String;
  isCoach: boolean;

  constructor(
    store: EnhancedStore<RootState, any>,
    currentDate: Date,
    applicationName: String,
    isCoach: boolean
  ) {
    this.store = store;
    this.interval = NotificationIntervals.oneMinute;
    this.lastCheckTimestamp = 0;
    this.currentDate = currentDate;
    this.applicationName = applicationName;
    this.isCoach = isCoach;
  }

  getNotifications = (): Message[] => {
    const { settings: settingsState } = this.store.getState();

    if (!settingsState || !settingsState.lastDataSync) return [];

    const lastSyncDate = new Date(
      settingsState.lastDataSync || this.currentDate
    );
    const daysPassed = Math.abs(
      differenceInCalendarDays(lastSyncDate, this.currentDate)
    );

    if (daysPassed < 7) return [];

    const defaultNotification: Message = {
      reference: `${getWeek(this.currentDate)}-${getYear(
        this.currentDate
      )}-sync`,
      title: 'We need to sync your data',
      message: `We suggest connecting to a wifi network to complete this process

                After syncing your data, the app will continue to work offline.

                If you choose not to sync now, you can still access the update

                at any time in the notifications area or choose manual update in

                 your profile`,
      dateCreated: new Date().toISOString(),
      priority: NotificationPriority.higher,
      viewOnDashboard: true,
      isFromBackend: false,
      area: 'data-sync',
      icon: 'SwitchVerticalIcon',
      color: 'alertMain',
      actionText: 'Sync my app',
      viewType: 'Both',
    };

    // Principal + Practitioner
    if (daysPassed >= 21 && !this.isCoach) {
      return [
        {
          ...defaultNotification,
          reference: `${getWeek(this.currentDate)}-${getYear(
            this.currentDate
          )}-sync-${
            daysPassed > 21 && daysPassed % 2 > 0 ? daysPassed.toString() : '21'
          }`,
          title: 'Go online again to keep using ' + this.applicationName + '!',
          message: `You haven't been online for more than 3 weeks. Turn on your wifi or data in the next week or you might lose some of your information!`,
        },
      ];
    }
    // Principal + Practitioner + Coach
    if (daysPassed >= 14) {
      return [
        {
          ...defaultNotification,
          reference: `${getWeek(this.currentDate)}-${getYear(
            this.currentDate
          )}-sync-14`,
          title: 'Go online again to keep using ' + this.applicationName + '!',
          message: `You haven't been online for more than 2 weeks. Make sure you turn on your wifi or data soon.`,
        },
      ];
    }

    // Coach only
    if (daysPassed >= 7 && this.isCoach) {
      return [
        {
          ...defaultNotification,
          reference: `${getWeek(this.currentDate)}-${getYear(
            this.currentDate
          )}-sync-7`,
          title: `You haven't been online in over a week!`,
          message: `Go online to see the most up to date information about your practitioners.`,
        },
      ];
    }

    return [];
  };
}
