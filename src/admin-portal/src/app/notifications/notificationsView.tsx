import { ActionListDataItem, StackedList, Typography } from '@ecdlink/ui';
import { useUser } from '../hooks/useUser';
import { useQuery } from '@apollo/client';
import { GetAllNotifications } from '@ecdlink/graphql';
import { NotificationsMessages } from '../components/notifications-messages/notifications-messages';
import { format } from 'date-fns';
import { useCallback } from 'react';

export const NotificationsView = () => {
  const { user } = useUser();
  const { data: notificationsData } = useQuery(GetAllNotifications, {
    variables: {
      userId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const notifications = notificationsData?.allNotifications;
  console.log({ notifications });
  const handleReadMessage = useCallback(() => {
    // TODO: Update when the read notification mutation be ready
  }, []);

  return (
    <div className="p-4">
      {notifications?.length === 0 && (
        <div className="h-100vh flex items-center justify-center">
          <Typography
            type={'h4'}
            color={'textDark'}
            text={'There are not notifications'}
            className="p-12"
          />
        </div>
      )}
      {notifications?.length > 0 &&
        notifications?.map((item) => (
          <NotificationsMessages
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
