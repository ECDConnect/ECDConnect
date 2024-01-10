import {
  ComponentBaseProps,
  DialogPosition,
  StackedList,
  StackedListItemType,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@store';
import { Notification, notificationActions } from '@store/notifications';
import { MessageActionConfig } from '@models/messages/messages';
import { NotificationHeaderCard } from '../notification-header-card/notification-header-card';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { notificationTagConfig } from '@/constants/notifications';
import {
  disableBackendNotification,
  markAsReadNotification,
} from '@/store/notifications/notifications.actions';

interface DashboardItemsProps extends ComponentBaseProps {
  listItems: StackedListItemType[];
  notification?: Notification;
}

export const DashboardItems: React.FC<DashboardItemsProps> = ({
  listItems,
  notification,
}) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();

  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const onActioned = (notification: Notification) => {
    if (
      !isOnline &&
      notification?.message?.actionText
        ?.toLocaleLowerCase()
        ?.includes('complete your profile')
    ) {
      return showOnlineOnly();
    }

    if (notification.message?.isFromBackend) {
      appDispatch(
        markAsReadNotification({
          notificationId: notification?.message?.reference ?? '',
        })
      );
    }

    if (notification.message.routeConfig) {
      history.push(
        notification.message.routeConfig.route,
        notification.message.routeConfig.params
      );
    }

    if (notification.message.action) {
      const action = JSON.parse(
        notification.message.action
      ) as MessageActionConfig;
      action?.url && history.push(action.url);
    }

    for (const [key, value] of Object.entries(notificationTagConfig)) {
      if (value.cta === notification.message.cta && value.routeConfig!) {
        history.push(value?.routeConfig?.route);
        break;
      }
    }
  };

  return (
    <>
      {notification && (
        <NotificationHeaderCard
          header={notification.message.title}
          message={notification.message.message}
          actionText={notification.message.actionText}
          onActioned={() => onActioned(notification)}
        />
      )}

      <StackedList
        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
        type="TitleList"
        listItems={listItems}
      />
    </>
  );
};
