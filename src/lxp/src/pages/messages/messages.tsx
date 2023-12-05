import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { usePaging } from '@hooks/usePaging';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  Notification,
  notificationActions,
  notificationsSelectors,
} from '@store/notifications';
import { IconInformationIndicator } from '../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import { MessageCard } from './components/message-card';

export const Messages: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  let notifications = useSelector(
    notificationsSelectors.getMessageBoardNotifications
  );

  notifications = notifications.sort(
    (a, b) =>
      new Date(b.message.dateCreated).getTime() -
      new Date(a.message.dateCreated).getTime()
  );

  const paging = usePaging<Notification>(notifications, 3, 0, 'accummilate');
  const appDispatch = useAppDispatch();
  console.log({ notifications });
  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Notifications',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    appDispatch(notificationActions.markAllNotificationsRead());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messageActioned = (notification: Notification) => {
    if (notification.message.routeConfig) {
      history.push(
        notification.message.routeConfig.route,
        notification.message.routeConfig.params
      );
    }
    appDispatch(notificationActions.removeNotification(notification));
  };

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Messages"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <div className="divide-uiLight divide-y-2 divide-dashed">
        {paging.visibleItems.length === 0 && (
          <IconInformationIndicator
            title="You don't have any messages"
            subTitle="Everything seems to be up to date."
            icon="InformationCircleIcon"
          />
        )}
        {paging.visibleItems.map((notification, idx) => {
          console.log({ notification });
          return (
            <MessageCard
              key={`message-card-${notification.message.reference}`}
              className={''}
              status={notification.isNew ? 'new' : 'viewed'}
              title={notification.message.title}
              message={notification.message.message}
              dateCreated={notification.message.dateCreated}
              actionText={notification.message.actionText}
              icon={notification.message.icon}
              iconBackgroundColor={notification.message.color}
              onAction={() => messageActioned(notification)}
            />
          );
        })}
      </div>
      {!paging.isLastPage &&
        paging.visibleItems &&
        paging.visibleItems.length > 0 && (
          <div
            className={'bg-uiBg flex flex-row items-center justify-center p-4'}
          >
            <Typography
              hasMarkup
              color="primary"
              text="<u>See more messages</u>"
              type="body"
              onClick={paging.getNextPage}
            />
          </div>
        )}
    </BannerWrapper>
  );
};
