import { createSelector } from 'reselect';
import { RootState } from '../types';
import { Notification } from './notifications.types';

export const getAllNotifications = createSelector(
  (state: RootState) => state.notifications.notifications,
  (notifications: Notification[]) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return [...notifications].filter((notification) => {
      if (!notification.message.expiryDate) {
        return true;
      }

      const expiryDate = new Date(notification.message.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);

      return expiryDate >= currentDate;
    });
  }
);

export const getAllNotificationReferences = createSelector(
  (state: RootState) => state.notifications.notificationReferences,
  (notificationReferences: string[]) => notificationReferences
);

export const getMessageBoardNotifications = createSelector(
  getAllNotifications,
  (notifications: Notification[]) =>
    notifications.filter((n) => n.message.viewType !== 'Hub')
);

export const getNewNotificationCount = createSelector(
  getAllNotifications,
  (notifications: Notification[]) =>
    notifications.filter((n) => n.isNew && n.message.viewType !== 'Hub').length
);

export const getDashboardNotification = createSelector(
  getAllNotifications,
  (notifications: Notification[]) => {
    return [...notifications]
      .sort((a, b) => (a.message.priority > b.message.priority ? 1 : -1))
      .find((n) => n.message.viewType !== 'Messages');
  }
);
