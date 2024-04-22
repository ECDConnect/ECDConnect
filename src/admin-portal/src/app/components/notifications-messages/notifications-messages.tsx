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
import { useMutation } from '@apollo/client';
import { MarkAsReadNotification } from '@ecdlink/graphql';

interface NotificationsMessagesProps {
  title: string;
  date: string;
  subject: string;
  statusColor: string;
  ctaText: string;
  action?: string;
  cTA: string;
  readDate?: string;
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
}) => {
  const history = useHistory();
  const [markAsRead] = useMutation(MarkAsReadNotification);
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

  const handleRedirectURL = (value: string) => {
    // TODO: Add more switch cases accordingly with the BE types
    switch (value) {
      case '[[AddMeetingReport]]':
        return ROUTES.TEAM_MEETINGS;
      default:
        return null;
    }
  };

  const handleNotificationClick = useCallback(() => {
    history?.push(handleRedirectURL(cTA));
    // markAsRead({
    //   variables: {
    //     id: 'ajdoifjdsif'
    //   }
    // })
  }, [cTA, history]);

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
