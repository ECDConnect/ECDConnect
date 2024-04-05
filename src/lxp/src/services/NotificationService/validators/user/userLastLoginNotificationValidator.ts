import { EnhancedStore } from '@reduxjs/toolkit';
import { addDays, differenceInCalendarDays, getWeek, getYear } from 'date-fns';
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

  constructor(store: EnhancedStore<RootState, any>, currentDate: Date) {
    this.store = store;
    this.interval = NotificationIntervals.oneMinute;
    this.lastCheckTimestamp = 0;
    this.currentDate = currentDate;
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

    let defaultNotification: Message = {
      reference: `${getWeek(this.currentDate)}-${getYear(
        this.currentDate
      )}-sync`,
      title: 'We need to sync your data',
      message: `We suggest connecting to a wifi network to complete this process

                After syncing your data, the Funda app will continue to work offline.

                If you choose not to sync now, you can still access the update

                at any time in the notifications area or choose manual update in

                 your profile`,
      dateCreated: new Date().toISOString(),
      priority: NotificationPriority.higher,
      viewOnDashboard: true,
      area: 'data-sync',
      icon: 'SwitchVerticalIcon',
      color: 'primary',
      actionText: 'Sync my app',
      viewType: 'Both',
    };

    if (daysPassed >= 21)
      return [
        {
          ...defaultNotification,
          reference: `${getWeek(this.currentDate)}-${getYear(
            this.currentDate
          )}-sync-${
            daysPassed > 21 && daysPassed % 2 > 0 ? daysPassed.toString() : '21'
          }`,
          title: 'Go online again to keep using Funda App!',
          message: `You haven't been online for more than 3 weeks. Turn on your wifi or data in the next week or you might lose some of your information!`,
        },
      ];

    if (daysPassed >= 14)
      return [
        {
          ...defaultNotification,
          reference: `${getWeek(this.currentDate)}-${getYear(
            this.currentDate
          )}-sync-14`,
          title: 'Go online again to keep using Funda App!',
          message: `You haven't been online for 14 days. Make sure you turn on your wifi or data soon.`,
        },
      ];

    if (daysPassed >= 7) {
      return [
        {
          ...defaultNotification,
          reference: `${getWeek(this.currentDate)}-${getYear(
            this.currentDate
          )}-sync-7`,
        },
      ];
    }

    return [];
  };
}
