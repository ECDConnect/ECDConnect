import { Button, Card, Typography } from '@ecdlink/ui';
import {
  ExclamationIcon,
  InformationCircleIcon,
  StarIcon,
} from '@heroicons/react/solid';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import ROUTES from '../../routes/app.routes-constants';
import { MessageStatusConstants } from './notifications-messages.types';
import { useMutation, useQuery } from '@apollo/client';
import {
  GetAllHealthCareWorker,
  GetAllPortalClinics,
  MarkAsReadNotification,
} from '@ecdlink/graphql';

interface NotificationsMessagesProps {
  title: string;
  date: string;
  subject: string;
  statusColor: string;
  ctaText: string;
  action?: string;
  cTA: string;
  readDate?: string;
  id: string;
  relatedToUserId?: string;
}

export const NotificationsMessages: React.FC<NotificationsMessagesProps> = ({
  title,
  date,
  subject,
  statusColor,
  ctaText,
  action,
  cTA,
  readDate,
  id,
  relatedToUserId,
}) => {
  const history = useHistory();
  const [markAsRead] = useMutation(MarkAsReadNotification);

  const { data, loading: loadingClinicsData } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: hcwData, loading: loadingHcwData } = useQuery(
    GetAllHealthCareWorker,
    {
      variables: {
        search: '',
        clinicSearch: [],
        provinceSearch: [],
        subDistrictSearch: [],
        visitSearch: [],
        connectUsageSearch: [],
        pagingInput: {
          pageNumber: 1,
          pageSize: null,
        },
        order: [
          {
            insertedDate: 'DESC',
          },
        ],
      },
      fetchPolicy: 'network-only',
    }
  );

  console.log({ data });
  console.log({ hcwData });

  const targetClinic = data?.allPortalClinics?.find(
    (item) => item?.id === relatedToUserId
  );
  const targetHcw = data?.allHealthCareWorkers?.find(
    (item) => item?.id === relatedToUserId
  );
  console.log({ targetClinic });

  const handleIcon = (type: string) => {
    switch (type) {
      case MessageStatusConstants.Amber:
        return (
          <ExclamationIcon className="bg-alertMain h-12 h-12 rounded-full p-3 text-white" />
        );
      case MessageStatusConstants.Blue:
        return (
          <InformationCircleIcon className="bg-infoMain h-12 h-12 rounded-full p-3 text-white" />
        );
      case MessageStatusConstants.Red:
        return (
          <InformationCircleIcon className="bg-alertMain h-12 h-12 rounded-full p-3 text-white" />
        );
      default:
        return (
          <StarIcon className="bg-successMain h-12 h-12 rounded-full p-3 text-white" />
        );
    }
  };

  const handleRedirectURL = useCallback(
    (value: string) => {
      // TODO: Add more switch cases accordingly with the BE types
      switch (value) {
        case '[[AddMeetingReport]]':
          return history.push(ROUTES.TEAM_MEETINGS);
        case '[[SeeClinicSummary]]':
          return history.push(ROUTES.TEAM_MEETINGS);
        case '[[ContactCHW]]':
          return history.push({
            pathname: ROUTES.VIEW_USERS,
            state: {
              component: 'chw',
              userId: targetHcw?.userId,
              clinicId: targetHcw?.clinicId,
              hcwId: targetHcw?.id,
              isRegistered: targetHcw?.isRegistered,
              connectUsage: targetHcw?.user?.connectUsage,
              connectUsageColor: targetHcw?.user?.connectUsageColor,
            },
          });
        default:
          return null;
      }
    },
    [
      history,
      targetHcw?.clinicId,
      targetHcw?.id,
      targetHcw?.isRegistered,
      targetHcw?.user?.connectUsage,
      targetHcw?.user?.connectUsageColor,
      targetHcw?.userId,
    ]
  );

  const handleNotificationClick = useCallback(() => {
    handleRedirectURL(cTA);
    markAsRead({
      variables: {
        notificationId: id,
      },
    });
  }, [cTA, handleRedirectURL, id, markAsRead]);

  return (
    <div className="w-full">
      <Card className="rounded-xl bg-white p-4">
        <div className="flex gap-3">
          {handleIcon(statusColor)}
          <div>
            <div className="flex items-center gap-2">
              <Typography type={'help'} text={date} color={'textLight'} />
              {!readDate && (
                <div className="bg-infoMain h-2 w-2 rounded-full" />
              )}
            </div>
            <Typography
              type={'body'}
              text={title}
              color={'textMid'}
              weight="bold"
            />
            <Typography type={'body'} text={subject} color={'textLight'} />
            <Button
              className="mt-2 rounded-xl px-4 shadow-none"
              text={ctaText}
              type="filled"
              color="secondary"
              textColor="white"
              onClick={handleNotificationClick}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
