import { ComponentBaseProps, StackedList, StackedListItemType } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@store';
import { Notification, notificationActions } from '@store/notifications';
import { NotificationHeaderCard } from '../notification-header-card/notification-header-card';

interface DashboardItemsProps extends ComponentBaseProps {
  listItems: StackedListItemType[];
  notification?: Notification;
}

export const DashboardItems: React.FC<DashboardItemsProps> = ({ listItems, notification }) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const onActioned = (notification: Notification) => {
    if (notification.message.routeConfig) {
      history.push(notification.message.routeConfig.route, notification.message.routeConfig.params);
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
        className="w-full bg-white rounded-b-md -mt-0.5"
        type="TitleList"
        listItems={listItems}
      />
    </>
  );
};
