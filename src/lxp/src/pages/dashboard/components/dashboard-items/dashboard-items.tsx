import {
  ComponentBaseProps,
  DialogPosition,
  StackedList,
  StackedListItemType,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@store';
import { Notification, notificationActions } from '@store/notifications';
import { NotificationHeaderCard } from '../notification-header-card/notification-header-card';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

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

    if (notification.message.routeConfig) {
      history.push(
        notification.message.routeConfig.route,
        notification.message.routeConfig.params
      );
    }
    appDispatch(notificationActions.removeNotification(notification));
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
