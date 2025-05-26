import { Typography } from '@ecdlink/ui';
import { useUser } from '../hooks/useUser';
import { useQuery } from '@apollo/client';
import { GetAllNotifications, Notification } from '@ecdlink/graphql';
import { NotificationsMessages } from '../components/notifications-messages/notifications-messages';
import { format } from 'date-fns';

export const NotificationsView = () => {
  const { user } = useUser();
  const { data: notificationsData, refetch: refetchNotification } = useQuery<{
    allNotifications: Notification[];
  }>(GetAllNotifications, {
    variables: {
      userId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const notifications = notificationsData?.allNotifications;

  return (
    <div className="p-4">
      {notifications?.length === 0 && (
        <div className="h-100vh flex items-center justify-center">
          <Typography
            type={'h4'}
            color={'textDark'}
            text={'You don’t have any notifications yet!'}
            className="p-12"
          />
        </div>
      )}
      {notifications?.length > 0 &&
        notifications?.map((item) => (
          <NotificationsMessages
            className="mb-4"
            refetchNotification={refetchNotification}
            ctaText={item?.cTAText}
            date={format(new Date(item?.messageDate), 'd MMMM y')}
            statusColor={item?.status}
            subject={item?.subject}
            title={item?.message}
            action={item?.action}
            cTA={item?.cTA}
            id={item?.id}
            relatedToUserId={item?.relatedToUserId}
            readDate={item?.readDate}
          />
        ))}
    </div>
  );
};
