import { createSelector } from 'reselect';
import { RootState } from '../types';
import { Notification } from './notifications.types';

export const getAllNotifications = createSelector(
  (state: RootState) => state.notifications.notifications,
  (notifications: Notification[]) => notifications
);

export const getAllNotificationReferences = createSelector(
  (state: RootState) => state.notifications.notificationReferences,
  (notificationReferences: string[]) => notificationReferences
);

export const getMessageBoardNotifications = createSelector(
  (state: RootState) => state.notifications.notifications,
  (notifications: Notification[]) =>
    notifications.filter((n) => n.message.viewType !== 'Hub')
);

export const getNewNotificationCount = createSelector(
  (state: RootState) => state.notifications.notifications,
  (notifications: Notification[]) =>
    notifications.filter((n) => n.isNew && n.message.viewType !== 'Hub').length
);

export const getDashboardNotification = createSelector(
  (state: RootState) => state.notifications.notifications,
  (notifications: Notification[]) =>
    [...notifications]
      .sort((a, b) => (a.message.priority > b.message.priority ? 1 : -1))
      .find((n) => n.message.viewType !== 'Messages')
);
