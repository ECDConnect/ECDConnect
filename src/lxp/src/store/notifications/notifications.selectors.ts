import { createSelector } from 'reselect';
import { RootState } from '../types';
import { Notification } from './notifications.types';
import { parseISO } from 'date-fns';
import { notificationTagConfig } from '@/constants/notifications';

export const getAllNotifications = createSelector(
  (state: RootState) => state.notifications.notifications,
  (notifications: Notification[]) => {
    const currentISODate = new Date().toISOString();
    const currentDate = parseISO(currentISODate.replace('Z', ''));

    const ctasMapped = Object.keys(notificationTagConfig).map(
      (key) => notificationTagConfig[key].cta
    );

    return [...notifications]?.filter((notification) => {
      const ISOdateCreated = new Date(
        notification?.message?.dateCreated
      ).toISOString();
      const dateCreated = parseISO(ISOdateCreated.replace('Z', ''));

      const isCtaOk =
        ctasMapped.includes(notification.message.cta) ||
        !notification.message.cta ||
        notification.message.action ||
        notification.message.routeConfig;

      if (!notification?.message?.expiryDate) {
        return dateCreated.getTime() <= currentDate.getTime() && isCtaOk;
      }

      const expiryIsoDate = new Date(
        notification?.message?.expiryDate
      ).toISOString();
      const expiryDate = parseISO(expiryIsoDate.replace('Z', ''));

      return (
        expiryDate.getTime() >= currentDate.getTime() &&
        dateCreated.getTime() <= currentDate.getTime() &&
        isCtaOk
      );
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
