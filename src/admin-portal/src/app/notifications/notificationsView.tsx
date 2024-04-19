import { ActionListDataItem, StackedList, Typography } from '@ecdlink/ui';
import { useUser } from '../hooks/useUser';
import { useQuery } from '@apollo/client';
import { GetAllNotifications } from '@ecdlink/graphql';
import { NotificationsMessages } from '../components/notifications-messages/notifications-messages';
import { format } from 'date-fns';

export const NotificationsView = () => {
  const { user } = useUser();
  const { data: notificationsData } = useQuery(GetAllNotifications, {
    variables: {
      userId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const notifications = notificationsData?.allNotifications;
  return (
    <div className="p-4">
      {notifications?.length === 0 && (
        <div>
          <Typography
            type={'h4'}
            color={'white'}
            text={'There are not notifications'}
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
          />
        ))}
    </div>
  );
};
