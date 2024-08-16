import {
  Alert,
  AlertType,
  ProfileAvatar,
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
  useState,
} from 'react';
import { ThumbUpIcon } from '@heroicons/react/solid';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetUserById,
  GetPractitionerByUserId,
  GetPractitionerStats,
} from '@ecdlink/graphql';
import { subDays } from 'date-fns';
import {
  UsersRolesTypeEnum,
  UsersRouteRedirectTypeEnum,
} from './view-user.types';
import { ConenctUsage } from '../users/sub-pages/team-leads/team-leads.types';
import { SendInvite } from './components/send-invite/send-invite';
import { DeactivateUser } from './components/deactivate-user/deactivate-user';
import { ReactivateUser } from './components/reactivate-user/reactivate-user';
import { PersonalInfo } from './components/personal-info/personal-info';
import ROUTES from '../../routes/app.routes-constants';
import { useUserRole } from '../../hooks/useUserRole';
import { TeamLeadClinics } from './components/team-lead-clinics/team-lead-clinics';
import { RoleSystemNameEnum } from '@ecdlink/core';
import { useTenant } from '../../hooks/useTenant';
import { PractitionerSummary } from './components/practitioner-summary/practitioner-summary';
import { PractitionerIssuesAndHighlights } from './components/practitioner-issues/practitioner-issues-and-highlights';
import { CoachSummary } from './components/coach-summary/coach-summary';
import { CoachIssuesAndHighlights } from './components/coach-issues-and-highlights/coach-issues-and-highlights';

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
  const isPractitioner =
    props.location.state?.component ===
    UsersRouteRedirectTypeEnum?.practitioner;
  const practitionerUserId = props?.location?.state?.userId;
  const isPrincipal =
    props.location.state?.component === UsersRouteRedirectTypeEnum?.principal;
  const isCoach =
    props.location.state?.component === UsersRouteRedirectTypeEnum?.coach;
  const isTeamLead =
    props.location.state?.component === UsersRouteRedirectTypeEnum?.teamLeads;
  const isFromAdministratorTable =
    props.location.state?.component === UsersRolesTypeEnum?.administrator;
  const isCHW =
    props.location.state?.component === UsersRouteRedirectTypeEnum?.chw;
  const clinicIds = props?.location?.state?.clinicIds;
  const isRegistered = props?.location?.state?.isRegistered;
  const [successNotification] = useState<boolean>(false);
  const tenant = useTenant();

  const {
    isTeamLead: isTeamLeadRole,
    isAdministrator,
    isSuperAdmin,
  } = useUserRole();

  const [startDate, setStartDate] = useState(startDate1);
  const [endDate, setEndDate] = useState(endDate1);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  let userId = localStorage.getItem('selectedUser');

  const paths: BreadcrumbProps['paths'] = isTeamLeadRole
    ? [
        { name: 'CHWs', url: ROUTES.USERS.HEALTH_CARE_WORKERS },
        { name: 'View user', url: '' },
      ]
    : [
        { name: 'Users', url: ROUTES.USERS.ALL_ROLES },
        ...(isFromAdministratorTable
          ? [{ name: 'Administrators', url: ROUTES.USERS.ADMINS }]
          : []),
        ...(isTeamLead
          ? [{ name: 'Team Leads', url: ROUTES.USERS.TEAM_LEADS }]
          : []),
        ...(isCHW
          ? [{ name: 'CHWs', url: ROUTES.USERS.HEALTH_CARE_WORKERS }]
          : []),
        ...(!isFromAdministratorTable && !isTeamLead && !isCHW
          ? [{ name: 'All roles', url: ROUTES.USERS.ALL_ROLES }]
          : []),
        { name: 'View user', url: '' },
      ];

  const [
    getPractitionerByUserId,
    {
      data: practitionerData,
      loading: loadingPractitioner,
      refetch: refetchGetPractitionerByUserId,
    },
  ] = useLazyQuery(GetPractitionerByUserId, {
    variables: {
      userId: practitionerUserId,
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (isPractitioner) {
      getPractitionerByUserId();
    }
  }, [getPractitionerByUserId, isPractitioner]);

  const [getPractitionerStats, { data: practitionerStatsData }] = useLazyQuery(
    GetPractitionerStats,
    {
      variables: {
        userId: practitionerUserId,
        startDate: startDate?.[0]?.toISOString() ?? startDate?.toISOString(),
        endDate: endDate?.[1]?.toISOString() ?? endDate?.toISOString(),
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (isPractitioner) {
      getPractitionerStats();
    }
  }, [getPractitionerStats, isPractitioner]);

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

  const isLoading = loadingUser;

  let isCHWRole = userData?.userById?.roles?.some(
    (role: any) => role.systemName === RoleSystemNameEnum.CHW
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
      case UsersRouteRedirectTypeEnum?.practitioner:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour="primary"
              backgroundColour="primary"
              textColour="white"
              text={UsersRolesTypeEnum?.practitioner}
            />
          </div>
        );
      case UsersRouteRedirectTypeEnum?.principal:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour="primary"
              backgroundColour="primary"
              textColour="white"
              text={UsersRolesTypeEnum?.principal}
            />
          </div>
        );
      case UsersRouteRedirectTypeEnum?.coach:
        return (
          <div>
            <StatusChip
              className="ml-auto self-center py-2"
              borderColour="primary"
              backgroundColour="primary"
              textColour="white"
              text={UsersRolesTypeEnum?.coach}
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
          dataUrl={userData?.userById?.profileImageUrl}
          onPressed={() => {}}
          hasConsent
          size="header"
        />
        <div className="flex flex-col justify-center gap-4">
          <Typography
            type="h1"
            color="textMid"
            text={userData?.userById?.fullName}
          />
          <div className="flex gap-2">
            {getRoleStatusChip(props.location.state?.component)}
            {(isTeamLead ||
              isCHWRole ||
              isPractitioner ||
              isPrincipal ||
              isCoach) &&
              getConnectUsageChip(connectUsage)}
          </div>
        </div>
      </div>

      {!userData?.userById?.isActive && (
        <Alert
          className="mt-5 mb-3"
          title={`This user has been deactivated and cannot access ${tenant.tenant?.applicationName} App`}
          type="error"
        />
      )}

      <PersonalInfo
        userData={userData?.userById}
        isRegistered={isRegistered}
        component={props?.location?.state?.component}
        isTeamLead={isTeamLead}
        hcwId={hcwId}
        clinicId={props?.location?.state?.clinicId}
        refetchUserData={refetchUserData}
        isAdministrator={isAdministrator || isSuperAdmin}
        isFromAdministratorTable={isFromAdministratorTable}
        userTypeToEdit={
          userData?.userById?.roles.length && userData?.userById?.roles[0].name
        }
        practitioner={practitionerData?.practitionerByUserId}
        refetchGetPractitionerByUserId={refetchGetPractitionerByUserId}
      />

      {(props.location.state?.component ===
        UsersRouteRedirectTypeEnum?.practitioner ||
        props.location.state?.component ===
          UsersRouteRedirectTypeEnum?.coach) &&
        isRegistered && (
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
            dateFormat={'d MMM yyyy'}
          />
        )}

      {isPractitioner && isRegistered && (
        <PractitionerSummary
          summaryData={practitionerStatsData?.practitionerStats}
        />
      )}

      {isCoach && isRegistered && (
        <CoachSummary summaryData={practitionerStatsData?.practitionerStats} />
      )}
      {isPractitioner && isRegistered && (
        <PractitionerIssuesAndHighlights
          summaryData={practitionerStatsData?.practitionerStats}
        />
      )}
      {isCoach && isRegistered && (
        <CoachIssuesAndHighlights
          summaryData={practitionerStatsData?.practitionerStats}
        />
      )}

      {(isTeamLead ||
        props.location.state?.component ===
          UsersRouteRedirectTypeEnum?.teamLeads) && (
        <>
          <TeamLeadClinics clinicIds={clinicIds} />
        </>
      )}

      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
        {userData?.userById?.isActive && (
          <div className="flex flex-col gap-2 lg:flex-row">
            {!isRegistered && (
              <SendInvite
                userData={userData?.userById}
                refetchUserData={refetchUserData}
              />
            )}
            {/* {isRegistered && isAdministrator && (
                <ResetUserPassword userData={userData?.userById} />
              )} */}
            <DeactivateUser
              userData={userData?.userById}
              refetchUserData={refetchUserData}
              isTeamLead={isTeamLead}
              isAdministrator={isAdministrator || isSuperAdmin}
              teamLeadId={teamLeadId}
              hcwId={hcwId}
            />
          </div>
        )}

        {!userData?.userById?.isActive && (
          <ReactivateUser
            userData={userData?.userById}
            refetchUserData={refetchUserData}
            isTeamLead={isTeamLead}
            isAdministrator={isAdministrator || isSuperAdmin}
            teamLeadId={teamLeadId}
            hcwId={hcwId}
          />
        )}

        <p className="ml-auto text-sm text-gray-600">
          User added to {tenant.tenant?.applicationName} App :{' '}
          {formatDate(userData?.userById?.insertedDate)}
        </p>
      </div>
    </div>
  );
}

export default ViewUser;
