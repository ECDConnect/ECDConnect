import { Button, Card, Typography } from '@ecdlink/ui';
import {
  ExclamationIcon,
  InformationCircleIcon,
  StarIcon,
} from '@heroicons/react/solid';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import ROUTES from '../../routes/app.routes-constants';
import {
  MessageStatusConstants,
  NotificationsCTAText,
} from './notifications-messages.types';
import { useMutation } from '@apollo/client';
import { DisableNotification, MarkAsReadNotification } from '@ecdlink/graphql';
import { classNames } from '../../pages/users/components/users';

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
  className?: string;
  refetchNotification: () => void;
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
  /*
   * Note from Matthew regarding the relatedToUserId prop:
   * Don't use the relatedToUserId field anymore, we need to replace it with the relatedEntities list
   */
  relatedToUserId,
  className,
  refetchNotification,
}) => {
  const history = useHistory();

  const [markAsRead] = useMutation(MarkAsReadNotification);

  const [disableNotification, { loading: loadingDisableNotification }] =
    useMutation(DisableNotification);

  const actionJson = JSON.parse(action || '{}');

  const isToShowDismissButton = [
    NotificationsCTAText.DuplicateClientPregnantMom,
    NotificationsCTAText.DuplicateClientChild,
    NotificationsCTAText.AdminNextMonthTLMeetingTopic,
    NotificationsCTAText.NoMeetingReportClinic,
    NotificationsCTAText.CHWsOptedOut,
  ].includes(cTA as NotificationsCTAText);

  const handleIcon = (type: string) => {
    switch (type) {
      case MessageStatusConstants.Amber:
        return (
          <ExclamationIcon className="bg-alertMain h-12 w-12 rounded-full p-3 text-white" />
        );
      case MessageStatusConstants.Blue:
        return (
          <InformationCircleIcon className="bg-infoMain h-12 w-12 rounded-full p-3 text-white" />
        );
      case MessageStatusConstants.Red:
        return (
          <InformationCircleIcon className="bg-alertMain h-12 w-12 rounded-full p-3 text-white" />
        );
      default:
        return (
          <StarIcon className="bg-successMain h-12 w-12 rounded-full p-3 text-white" />
        );
    }
  };

  const handleRedirectURL = useCallback((value: string) => {
    // TODO: Add more switch cases accordingly with the BE types
    switch (value) {
      // case NotificationsCTAText.AddMeetingReport:
      //   return history.push(ROUTES.TEAM_MEETINGS, {
      //     clinicId: targetClinic?.id,
      //   });
      // case NotificationsCTAText.SeeClinicSummary:
      //   return history.push(ROUTES.TEAM_MEETINGS, {
      //     clinicId: targetClinic?.id,
      //   });
      // case NotificationsCTAText.ContactCHW:
      //   return goToTargetChw();
      // case NotificationsCTAText.AddLeagues:
      //   return history.push(ROUTES.CLINICS.LEAGUES.ROOT);
      // case NotificationsCTAText.AssignToLeagues:
      //   return history.push(ROUTES.CLINICS.LEAGUES.ROOT);
      // case NotificationsCTAText.CHWsOptedOut:
      //   return history.push(ROUTES.HEALTH_CARE_WORKER.OPTED_OUT, {
      //     ...actionJson?.state,
      //   } as HealthCareWorkerOptedOutRouteState);
      // case NotificationsCTAText.DuplicateClientPregnantMom:
      //   return goToTargetChw();
      // case NotificationsCTAText.DuplicateClientChild:
      //   return goToTargetChw();
      // case NotificationsCTAText.AdminNextMonthTLMeetingTopic:
      //   return history.push(ROUTES.TL_MEETINGS.EDIT_TOPICS);
      // case NotificationsCTAText.ClinicMissingTL:
      //   return history.push({
      //     pathname: ROUTES.CLINICS.VIEW_CLINICS,
      //     state: {
      //       clinic: targetClinic,
      //       openEditPanel: true,
      //     } as ClinicsRouteState,
      //   });
      // case NotificationsCTAText.NoMeetingReportClinic:
      //   return goToTargetTeamLead();
      default:
        return null;
    }
  }, []);

  const handleNotificationClick = useCallback(() => {
    handleRedirectURL(cTA);
    if (!readDate) {
      markAsRead({
        variables: {
          notificationId: id,
        },
      });
    }
  }, [cTA, handleRedirectURL, id, markAsRead, readDate]);

  const onDismiss = () => {
    disableNotification({
      variables: {
        notificationId: id,
      },
      onCompleted: () => refetchNotification(),
    });
  };

  // if (loadingClinicsData || loadingHcwData || loadingTeamLeadData) {
  //   return (
  //     <div className={classNames(className, 'w-full rounded-xl bg-white p-4')}>
  //       <LoadingSpinner
  //         size="medium"
  //         spinnerColor="adminPortalBg"
  //         backgroundColor="secondary"
  //       />
  //     </div>
  //   );
  // }

  return (
    <Card
      className={classNames(
        className,
        'flex w-full gap-3 rounded-xl bg-white p-4'
      )}
    >
      {handleIcon(statusColor)}
      <div>
        <div className="flex items-center gap-2">
          <Typography type={'help'} text={date} color={'textLight'} />
          {!readDate && <div className="bg-infoMain h-2 w-2 rounded-full" />}
        </div>
        <Typography
          type={'body'}
          text={title}
          color={'textMid'}
          weight="bold"
        />
        <Typography type={'body'} text={subject} color={'textLight'} />
        <div className="flex gap-3">
          <Button
            className="mt-2 rounded-xl px-4 shadow-none hover:opacity-80"
            disabled={loadingDisableNotification}
            isLoading={loadingDisableNotification}
            text={ctaText}
            type="filled"
            color="secondary"
            textColor="white"
            onClick={handleNotificationClick}
          />
          {isToShowDismissButton && (
            <Button
              disabled={loadingDisableNotification}
              isLoading={loadingDisableNotification}
              className="mt-2 rounded-xl px-4 shadow-none hover:opacity-80"
              text="Dismiss"
              type="outlined"
              color="tertiary"
              textColor="tertiary"
              onClick={onDismiss}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
