import {
  Alert,
  AlertType,
  ProfileAvatar,
  classNames,
  StatusChip,
  Breadcrumb,
  BreadcrumbProps,
  Typography,
  DatePicker,
  LoadingSpinner,
} from '@ecdlink/ui';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThumbUpIcon } from '@heroicons/react/solid';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetHealthCareWorkerByUserId,
  GetTenantContext,
  GetUserById,
  GetHealthCareWorkerSummaryForPeriod,
  GetTeamLeadSummary,
} from '@ecdlink/graphql';
import { subDays } from 'date-fns';
import {
  UsersRolesTypeEnum,
  UsersRouteRedirectTypeEnum,
} from './view-user.types';
import { TeamLeadSummary } from './components/team-lead-summary/team-lead-summary';
import { TeamLeadMeetingReport } from './components/team-lead-meeting-reports/team-lead-meeting-reports';
import { ConenctUsage } from '../users/sub-pages/team-leads/team-leads.types';
import { SendInvite } from './components/send-invite/send-invite';
import { DeactivateUser } from './components/deactivate-user/deactivate-user';
import { HealthCareWorkerSummary } from './components/health-care-worker-summary/health-care-worker-summary';
import { HealthCareWorkerIssues } from './components/health-care-worker-issues/health-care-worker-issues';
import { HealthCareWorkerHighlights } from './components/health-care-worker-highlights/health-care-worker-highlights';
import { PersonalInfo } from './components/personal-info/personal-info';
import { GrowGreatRoles, TenantContext } from '../../utils/constants';
import ROUTES from '../../routes/app.routes-constants';
import { useUserRole } from '../../hooks/useUserRole';

const formatDate = (value: string | number | Date) => {
  try {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  } catch (e) {
    return 'N/A';
  }
};
const showNotification = (
  message: string,
  type: AlertType,
  icon?: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return (
    <Alert
      className="mx-20 mt-5 mb-3 rounded-md"
      message={message}
      type={type}
      customIcon={icon}
    />
  );
};

export function ViewUser(props: any) {
  const currentDate = new Date();
  const startDate1 = subDays(currentDate, 30);
  const endDate1 = currentDate;
  const connectUsage = props?.location?.state?.connectUsage;
  const connectUsageColor = props?.location?.state?.connectUsageColor;
  const hcwId = props?.location?.state?.hcwId;
  const teamLeadId = props?.location?.state?.teamLeadId;
  const isTeamLead =
    props.location.state?.component === UsersRouteRedirectTypeEnum?.teamLeads;
  const isAdministrator =
    props.location.state?.component === UsersRolesTypeEnum?.administrator;
  const clinicIds = props?.location?.state?.clinicIds;
  const isRegistered = props?.location?.state?.isRegistered;
  const [successNotification] = useState<boolean>(false);

  const { isTeamLead: isTeamLeadRole } = useUserRole();

  const [startDate, setStartDate] = useState(startDate1);
  const [endDate, setEndDate] = useState(endDate1);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  let userId = localStorage.getItem('selectedUser');

  const paths: BreadcrumbProps['paths'] = [
    { name: 'CHWs', url: ROUTES.USERS.HEALTH_CARE_WORKERS },
    { name: 'View user', url: '' },
  ];

  const { data, loading: loadingTenant } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const [
    getChwById,
    { data: chwData, refetch: refetchCHW, loading: loadingChw },
  ] = useLazyQuery(GetHealthCareWorkerByUserId, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: userData,
    refetch: refetchUserData,
    loading: loadingUser,
  } = useQuery(GetUserById, {
    variables: {
      userId: props.location.state.userId ?? userId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getHealthCareWorkerSummaryForPeriod, { data: summaryData }] =
    useLazyQuery(GetHealthCareWorkerSummaryForPeriod, {
      variables: {
        userId: '',
        healthCareWorkerId: '',
        startDate: '',
        endDate: '',
      },
      fetchPolicy: 'cache-and-network',
    });

  const isLoading = loadingTenant || loadingChw || loadingUser;

  useEffect(() => {
    getHealthCareWorkerSummaryForPeriod({
      variables: {
        userId: props.location.state.userId ?? userId,
        healthCareWorkerId:
          chwData?.GetHealthCareWorkerById?.user?.id ??
          props.location.state.userId ??
          userId,
        startDate: startDate?.[0]?.toISOString() ?? startDate?.toISOString(),
        endDate: endDate?.[1]?.toISOString() ?? endDate?.toISOString(),
      },
    });
  }, [
    chwData?.GetHealthCareWorkerById?.user?.id,
    endDate,
    getHealthCareWorkerSummaryForPeriod,
    props.location.state.userId,
    startDate,
    userId,
  ]);

  const [getTeamLeadSummary, { data: teamLeadSummary }] = useLazyQuery(
    GetTeamLeadSummary,
    {
      variables: {
        teamLeadId: teamLeadId,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (teamLeadId) {
      getTeamLeadSummary();
    }
  }, [getTeamLeadSummary, teamLeadId]);

  const teamLeadReportData = useMemo(
    () => teamLeadSummary?.teamLeadSummary,
    [teamLeadSummary?.teamLeadSummary]
  );

  useEffect(() => {
    props.location.state?.component === UsersRouteRedirectTypeEnum?.chw &&
      getChwById({
        variables: { userId: props.location.state.userId ?? userId },
      });
  }, [userId]);

  const isNotLockedOut = (user) => {
    if (!user) return true;
    return !user?.lockoutEnd || user?.lockoutEnd < new Date();
  };

  let isCHW = userData?.userById?.roles?.some(
    (role: any) => role.name === GrowGreatRoles.HealthCareWorker
  );

  const getRoleStatusChip = (status: string) => {
    switch (status) {
      case UsersRouteRedirectTypeEnum?.chw:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour="tertiary"
              backgroundColour="tertiary"
              textColour="white"
              text={UsersRolesTypeEnum?.chw}
            />
          </div>
        );
      case UsersRouteRedirectTypeEnum?.teamLeads:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour="darkBlue"
              backgroundColour="darkBlue"
              textColour="white"
              text={UsersRolesTypeEnum?.teamLeads}
            />
          </div>
        );
      case UsersRolesTypeEnum?.administrator:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour="darkBlue"
              backgroundColour="darkBlue"
              textColour="white"
              text={UsersRolesTypeEnum?.administrator}
            />
          </div>
        );
      default:
        return (
          <div>
            <StatusChip
              className="self-cente py-2r ml-auto"
              borderColour="infoDark"
              backgroundColour="infoDark"
              textColour="white"
              text={UsersRolesTypeEnum?.user}
            />
          </div>
        );
    }
  };

  const getConnectUsageChip = (value: string) => {
    switch (value) {
      case ConenctUsage?.InvitationActive:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour={connectUsageColor}
              backgroundColour={connectUsageColor}
              textColour="white"
              text={connectUsage}
            />
          </div>
        );
      case ConenctUsage?.InvitationExpired:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour={connectUsageColor}
              backgroundColour={connectUsageColor}
              textColour="white"
              text={connectUsage}
            />
          </div>
        );
      case ConenctUsage?.LastOnlineOver6Months:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour={connectUsageColor}
              backgroundColour={connectUsageColor}
              textColour="white"
              text={connectUsage}
            />
          </div>
        );
      case ConenctUsage?.LastOnlineWithinPast6Months:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour={connectUsageColor}
              backgroundColour={connectUsageColor}
              textColour="white"
              text={connectUsage}
            />
          </div>
        );
      default:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour={connectUsageColor}
              backgroundColour={connectUsageColor}
              textColour="white"
              text={connectUsage}
            />
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        backgroundColor="secondary"
        spinnerColor="white"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <Breadcrumb paths={paths} />
      {successNotification &&
        showNotification(
          'User Added Successfully! ',
          'success',
          <ThumbUpIcon className="h-10 w-10"></ThumbUpIcon>
        )}

      <div className="mt-9 mb-7 flex gap-7">
        <ProfileAvatar
          canChangeImage={false}
          dataUrl={
            userData?.userById?.profileImageUrl ||
            chwData?.GetHealthCareWorkerById?.user?.profileImageUrl
          }
          onPressed={() => {}}
          hasConsent
          size="header"
        />
        <div className="flex flex-col justify-center gap-4">
          <Typography
            type="h1"
            color="textMid"
            text={
              userData?.userById?.fullName ??
              chwData?.GetHealthCareWorkerById?.user?.fullName
            }
          />
          <div className="flex gap-2">
            {getRoleStatusChip(props.location.state?.component)}
            {(isTeamLead || isCHW) && getConnectUsageChip(connectUsage)}
          </div>
        </div>
      </div>
      {chwData &&
        chwData?.GetHealthCareWorkerById?.user?.roles?.map(
          (i: any, index: number) => {
            return (
              <div
                key={i.id}
                className={classNames(
                  i.name === GrowGreatRoles.HealthCareWorker
                    ? 'bg-primary'
                    : 'bg-tertiary',
                  ' m-1 my-2 flex flex-row justify-center rounded-full py-1  px-3 text-xs text-white'
                )}
              >
                <p className="text-16">
                  {' '}
                  {i.name === GrowGreatRoles.HealthCareWorker ? 'CHW' : i.name}
                </p>
              </div>
            );
          }
        )}
      {!isNotLockedOut(
        userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
      ) && (
        <Alert
          className="mt-5 mb-3"
          message={`This user has been deactivated and cannot access ${data?.tenantContext.applicationName} App`}
          type="error"
        />
      )}

      <PersonalInfo
        userData={userData?.userById}
        chwData={chwData?.GetHealthCareWorkerById}
        isRegistered={isRegistered}
        component={props?.location?.state?.component}
        isTeamLead={isTeamLead}
        hcwId={hcwId}
        clinicId={props?.location?.state?.clinicId}
        refetchUserData={refetchUserData}
        refetchCHW={refetchCHW}
        isNotLockedOut={isNotLockedOut}
        clinicIds={clinicIds}
        isAdministrator={isAdministrator}
      />

      {(isCHW ||
        props.location.state?.component === UsersRouteRedirectTypeEnum?.chw) &&
        isRegistered &&
        data &&
        data.tenantContext &&
        data.tenantContext.applicationName === TenantContext.GrowGreat && (
          <DatePicker
            selectsRange
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            shouldCloseOnSelect
            colour="secondary"
            textColour="white"
            hideCalendarIcon
            chevronIconColour="white"
            showChevronIcon
            isFullWidth={false}
            className="w-64 self-end rounded-xl"
          />
        )}

      {(isCHW ||
        props.location.state?.component === UsersRouteRedirectTypeEnum?.chw) &&
        isRegistered && (
          <HealthCareWorkerSummary
            summaryData={summaryData?.healthCareWorkerSummaryForPeriod}
          />
        )}
      {(isCHW ||
        props.location.state?.component === UsersRouteRedirectTypeEnum?.chw) &&
        isRegistered && (
          <HealthCareWorkerIssues
            summaryData={summaryData?.healthCareWorkerSummaryForPeriod}
          />
        )}
      {(isCHW ||
        props.location.state?.component === UsersRouteRedirectTypeEnum?.chw) &&
        isRegistered && (
          <HealthCareWorkerHighlights
            summaryData={summaryData?.healthCareWorkerSummaryForPeriod}
          />
        )}

      {(isTeamLead ||
        props.location.state?.component ===
          UsersRouteRedirectTypeEnum?.teamLeads) &&
        isRegistered && (
          <>
            <TeamLeadSummary teamLeadReportData={teamLeadReportData} />
            <TeamLeadMeetingReport teamLeadReportData={teamLeadReportData} />
          </>
        )}

      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
        {isNotLockedOut(
          userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
        ) &&
          !isAdministrator &&
          !isTeamLeadRole && (
            <div className="flex flex-col gap-2 lg:flex-row">
              {isRegistered && (
                <SendInvite
                  userData={userData?.userById}
                  chwData={chwData?.GetHealthCareWorkerById}
                  refetchUserData={refetchUserData}
                />
              )}
              <DeactivateUser
                userData={userData?.userById}
                chwData={chwData?.GetHealthCareWorkerById}
                refetchUserData={refetchUserData}
                isTeamLead={isTeamLead}
                teamLeadId={teamLeadId}
                hcwId={hcwId}
              />
            </div>
          )}

        <p className="ml-auto text-sm text-gray-600">
          User added to {data?.tenantContext.applicationName} App :{' '}
          {formatDate(
            chwData?.GetHealthCareWorkerById?.insertedDate ||
              userData?.userById?.insertedDate
          )}
        </p>
      </div>
    </div>
  );
}

export default ViewUser;
