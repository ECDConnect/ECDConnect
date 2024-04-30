import { Button, Card, LoadingSpinner, Typography } from '@ecdlink/ui';
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
import { useMutation, useQuery } from '@apollo/client';
import {
  DisableNotification,
  GetAllHealthCareWorker,
  GetClinicById,
  MarkAsReadNotification,
  PortalUsersHcwModel,
  PortalUsersTlModel,
} from '@ecdlink/graphql';
import { classNames } from '../../pages/users/components/users';
import { useUserRole } from '../../hooks/useUserRole';
import { ClinicsRouteState } from '../../pages/clinics/main-view/admin-view/clinics.types';
import { ClinicDto } from '@ecdlink/core';
import { HealthCareWorkerOptedOutRouteState } from '../../pages/health-care-worker/health-care-worker-opted-out/types';
import { UsersRouteRedirectTypeEnum } from '../../pages/view-user/view-user.types';

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
  relatedToUserId,
  className,
  refetchNotification,
}) => {
  const history = useHistory();

  const { isTeamLead } = useUserRole();

  const [markAsRead] = useMutation(MarkAsReadNotification);

  const [disableNotification, { loading: loadingDisableNotification }] =
    useMutation(DisableNotification);

  const actionJson = JSON.parse(action || '{}');

  const healthCareWorkerId = actionJson?.state?.healthCareWorkerId;
  const clinicId = actionJson?.state?.clinicId;
  const teamLeadId = actionJson?.state?.teamLeadId;

  const { data: clinicData, loading: loadingClinicsData } = useQuery<{
    GetClinicById: ClinicDto;
  }>(GetClinicById, {
    variables: {
      id: clinicId || relatedToUserId,
    },
    fetchPolicy: 'cache-and-network',
    skip: (!relatedToUserId && !clinicId) || !!healthCareWorkerId,
  });

  // TODO: Add a query to get the HCW by ID (with PortalUsersHcwModel type)
  const { data: hcwData, loading: loadingHcwData } = useQuery<{
    allHealthCareWorkers: PortalUsersHcwModel[];
  }>(GetAllHealthCareWorker, {
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
    skip: (!relatedToUserId && !healthCareWorkerId) || !!clinicId,
  });

  const targetClinic = clinicData?.GetClinicById;
  const targetHcw = hcwData?.allHealthCareWorkers?.find(
    (item) => item?.id === healthCareWorkerId || item?.id === relatedToUserId
  );
  // TODO: get the team lead by ID
  const targetTeamLead = {} as PortalUsersTlModel;

  const isToShowDismissButton =
    !isTeamLead &&
    [
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

  const goToTargetChw = useCallback(() => {
    history.push({
      pathname: ROUTES.VIEW_USERS,
      state: {
        component: UsersRouteRedirectTypeEnum.chw,
        userId: targetHcw?.user?.id,
        clinicId: targetHcw?.clinicId,
        hcwId: targetHcw?.id,
        isRegistered: targetHcw?.isRegistered,
        connectUsage: targetHcw?.user?.connectUsage,
        connectUsageColor: targetHcw?.user?.connectUsageColor,
      },
    });
  }, [
    history,
    targetHcw?.clinicId,
    targetHcw?.id,
    targetHcw?.isRegistered,
    targetHcw?.user?.connectUsage,
    targetHcw?.user?.connectUsageColor,
    targetHcw?.user?.id,
  ]);

  const goToTargetTeamLead = useCallback(() => {
    history.push({
      pathname: ROUTES.VIEW_USERS,
      state: {
        component: UsersRouteRedirectTypeEnum.teamLeads,
        userId: targetTeamLead?.user?.id,
        teamLeadId: targetTeamLead?.id,
        connectUsage: targetTeamLead?.connectUsage,
        isRegistered: targetTeamLead?.isRegistered,
        clinicIds: targetTeamLead?.clinicIds,
        connectUsageColor: targetTeamLead?.user?.connectUsageColor,
      },
    });
  }, [history, targetTeamLead]);

  const handleRedirectURL = useCallback(
    (value: string) => {
      // TODO: Add more switch cases accordingly with the BE types
      switch (value) {
        case NotificationsCTAText.AddMeetingReport ||
          NotificationsCTAText.SeeClinicSummary:
          return history.push(ROUTES.TEAM_MEETINGS, {
            clinicId: targetClinic?.id,
          });
        case NotificationsCTAText.ContactCHW:
          return goToTargetChw();
        case NotificationsCTAText.AddLeagues:
          return history.push(ROUTES.CLINICS.LEAGUES.ROOT);
        case NotificationsCTAText.AssignToLeagues:
          return history.push(ROUTES.CLINICS.LEAGUES.ROOT);
        case NotificationsCTAText.CHWsOptedOut:
          return history.push(ROUTES.HEALTH_CARE_WORKER.OPTED_OUT, {
            ...actionJson?.state,
          } as HealthCareWorkerOptedOutRouteState);
        case NotificationsCTAText.DuplicateClientPregnantMom:
          return goToTargetChw();
        case NotificationsCTAText.DuplicateClientChild:
          return goToTargetChw();
        case NotificationsCTAText.AdminNextMonthTLMeetingTopic:
          return history.push(ROUTES.TL_MEETINGS.EDIT_TOPICS);
        case NotificationsCTAText.ClinicMissingTL:
          return history.push({
            pathname: ROUTES.CLINICS.VIEW_CLINICS,
            state: {
              clinic: targetClinic,
              openEditPanel: true,
            } as ClinicsRouteState,
          });
        case NotificationsCTAText.NoMeetingReportClinic:
          return goToTargetTeamLead();
        default:
          return null;
      }
    },
    [
      actionJson?.state,
      goToTargetChw,
      goToTargetTeamLead,
      history,
      targetClinic,
    ]
  );

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

  if (loadingClinicsData || loadingHcwData) {
    return (
      <div className={classNames(className, 'w-full rounded-xl bg-white p-4')}>
        <LoadingSpinner
          size="medium"
          spinnerColor="adminPortalBg"
          backgroundColor="secondary"
        />
      </div>
    );
  }

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
