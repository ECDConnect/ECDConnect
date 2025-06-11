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
import { notificationTagConfig } from '@/constants/notifications';
import {
  disableBackendNotification,
  markAsReadNotification,
} from '@/store/notifications/notifications.actions';
import { MessageActionConfig } from '@models/messages/messages';
import { referenceNames } from '@/services/NotificationService/validators/points/poinstNotificationValidator.types';

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

  // useEffect(() => {
  //   appDispatch(notificationActions.markAllNotificationsRead());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const removeNotification = (notification: Notification) => {
    if (notification.message?.isFromBackend) {
      appDispatch(
        markAsReadNotification({
          notificationId: notification?.message?.reference ?? '',
        })
      );
      appDispatch(
        disableBackendNotification({
          notificationId: notification?.message?.reference ?? '',
        })
      );
    }

    appDispatch(notificationActions.removeNotification(notification!));

    const notificationIndex = paging.visibleItems?.findIndex(
      (n) => n.message.reference === notification.message.reference
    );

    if (notificationIndex!! < 0) return;

    paging.visibleItems?.splice(notificationIndex!!, 1);
  };

  const messageActioned = (notification: Notification) => {
    if (notification.message?.isFromBackend) {
      appDispatch(
        markAsReadNotification({
          notificationId: notification?.message?.reference ?? '',
        })
      );
    }

    appDispatch(
      notificationActions.markNotificationRead({
        reference: notification?.message?.reference ?? '',
      })
    );

    if (
      notification.message?.cta?.includes(
        notificationTagConfig?.TrackIncome?.cta ?? ''
      ) ||
      notification.message?.cta?.includes(
        notificationTagConfig?.ProgressSummary?.cta ?? ''
      ) ||
      notification.message?.cta?.includes(
        notificationTagConfig?.SeeClasses?.cta ?? ''
      )
    ) {
      appDispatch(notificationActions.removeNotification(notification!));
      if (notification.message?.isFromBackend) {
        appDispatch(
          disableBackendNotification({
            notificationId: notification?.message?.reference ?? '',
          })
        );
      }
    }

    if (notification.message.action) {
      const action = JSON.parse(
        notification.message.action
      ) as MessageActionConfig;

      if (action.state?.activeTabIndex) {
        return (
          action?.url &&
          history.push({
            pathname: action.url,
            state: {
              activeTabIndex: Number(action.state.activeTabIndex),
            },
          })
        );
      } else {
        return (
          action?.url &&
          history.push({ pathname: action.url, state: action.state })
        );
      }
    }

    for (const [key, value] of Object.entries(notificationTagConfig)) {
      if (value.cta === notification.message.cta && value.routeConfig!) {
        return history.push(value?.routeConfig?.route);
      }
    }

    const resetNotificationOnClick =
      notification?.message?.reference ===
        referenceNames?.yearPointsGreaterThen0 ||
      // notification?.message?.reference ===
      //   referenceNames?.getSevenDaysBeforeWithNoProgressReports ||
      notification?.message?.reference ===
        referenceNames?.allChildrenProgressReportsCompleted ||
      notification?.message?.priority === 8;

    if (resetNotificationOnClick) {
      appDispatch(notificationActions.removeNotification(notification!));
    }

    if (notification.message.routeConfig) {
      history.push(
        notification.message.routeConfig.route,
        notification.message.routeConfig.params
      );
    }

    const notificationIndex = paging.visibleItems?.findIndex(
      (n) => n.message.reference === notification.message.reference
    );

    if (notificationIndex!! < 0) return;

    paging.visibleItems?.splice(notificationIndex!!, 1);
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
          return (
            <MessageCard
              key={`message-card-${notification.message.reference}`}
              className={''}
              status={notification?.isNew ? 'new' : 'viewed'}
              title={notification.message.title}
              message={notification.message.message}
              dateCreated={notification.message.dateCreated}
              actionText={notification.message.actionText || 'Remove'}
              icon={notification.message.icon}
              iconBackgroundColor={notification.message.color}
              onAction={() =>
                notification.message.actionText
                  ? messageActioned(notification)
                  : removeNotification(notification)
              }
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
