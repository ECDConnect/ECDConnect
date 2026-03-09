import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  notificationActions,
  notificationsSelectors,
} from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { useAppDispatch } from '@store';

export function useRemoveNotifications({
  cta,
  reference,
}: {
  cta?: string;
  reference?: string;
}) {
  const dispatch = useAppDispatch();
  const notifications = useSelector(notificationsSelectors.getAllNotifications);

  const filteredNotifications = notifications.filter((item) => {
    if (cta && item?.message?.cta?.includes(cta)) return true;
    if (reference && item?.message?.reference === reference) return true;
    return false;
  });

  const removeNotifications = useCallback(() => {
    filteredNotifications.forEach((notification) => {
      if (notification.message?.isFromBackend) {
        dispatch(
          disableBackendNotification({
            notificationId: notification.message.reference ?? '',
          })
        );
      }
      dispatch(notificationActions.removeNotification(notification));
    });
  }, [filteredNotifications, dispatch]);

  return removeNotifications;
}
