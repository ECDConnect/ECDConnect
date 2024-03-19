import {
  Alert,
  Button,
  DialogPosition,
  Typography,
  AlertType,
  ProfileAvatar,
  classNames,
  StatusChip,
} from '@ecdlink/ui';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { TrashIcon, ArrowLeftIcon, ThumbUpIcon } from '@heroicons/react/solid';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import CustomDateRangePicker from '../../components/date-picker/index';
import {
  DeleteUser,
  GetHealthCareWorkerByUserId,
  GetTenantContext,
  GetUserById,
  GetHealthCareWorkerSummaryForPeriod,
  GetTeamLeadSummary,
} from '@ecdlink/graphql';
import { useUser } from '../../hooks/useUser';
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
import { HalthCareWorkerHighlights } from './components/health-care-worker-highlights/health-care-worker-highlights';
import { PersonalInfo } from './components/personal-info/personal-info';
import { GrowGreatRoles, TenantContext } from '../../utils/constants';

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
  const startDate = subDays(currentDate, 30);
  const endDate = currentDate;
  const connectUsage = props?.location?.state?.connectUsage;
  const hcwId = props?.location?.state?.hcwId;
  const teamLeadId = props?.location?.state?.teamLeadId;
  const isTeamLead =
    props.location.state?.component === UsersRouteRedirectTypeEnum?.teamLeads;
  const isAdministrator =
    props.location.state?.component === UsersRolesTypeEnum?.administrator;
  const clinicIds = props?.location?.state?.clinicIds;
  const isRegistered = props?.location?.state?.isRegistered;
  const [successNotification] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<Date[]>([
    startDate,
    endDate,
  ]);

  const handleDateChange = (range: Date[]) => {
    setSelectedRange(range);
  };
  const history = useHistory();
  const [deleteUser] = useMutation(DeleteUser);

  let userId = localStorage.getItem('selectedUser');
  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const [getChwById, { data: chwData, refetch: refetchCHW }] = useLazyQuery(
    GetHealthCareWorkerByUserId,
    {
      variables: {
        userId: '',
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const { data: userData, refetch: refetchUserData } = useQuery(GetUserById, {
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

  useEffect(() => {
    getHealthCareWorkerSummaryForPeriod({
      variables: {
        userId: props.location.state.userId ?? userId,
        healthCareWorkerId:
          chwData?.GetHealthCareWorkerById?.user?.id ??
          props.location.state.userId ??
          userId,
        startDate: selectedRange[0]?.toISOString() ?? startDate.toISOString(),
        endDate: selectedRange[1]?.toISOString() ?? endDate.toISOString(),
      },
    });
  }, [selectedRange]);

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

  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();

  const isNotLockedOut = (user) => {
    if (!user) return true;
    return !user?.lockoutEnd || user?.lockoutEnd < new Date();
  };

  const deactivateUser = async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Deactivate User"
          btnText={['Yes, Deactivate User', 'No, Cancel']}
          message={`${
            chwData?.GetHealthCareWorkerById?.user?.firstName ??
            userData.userById.fullName
          } will lose their access to ${
            data?.tenantContext.applicationName
          } App immediately. Make sure you have communicated with them before deactivating them.`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            deleteUser({
              variables: {
                id:
                  userData?.userById?.id ?? chwData.GetHealthCareWorkerById.id,
              },
            })
              .then((response: any) => {
                if (response.data.deleteUser) {
                  setNotification({
                    title: 'Successfully Deactivated User!',
                    variant: NOTIFICATION.SUCCESS,
                  });
                }
              })
              .catch((error) => {
                setNotification({
                  title: 'Failed to Delete User!',
                  variant: NOTIFICATION.ERROR,
                });
              });
          }}
        />
      ),
    });
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
              borderColour="infoMain"
              backgroundColour="infoMain"
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
              borderColour="errorMain"
              backgroundColour="errorMain"
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
              borderColour="darkBlue"
              backgroundColour="darkBlue"
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
              borderColour="darkBlue"
              backgroundColour="darkBlue"
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
              borderColour="errorMain"
              backgroundColour="errorMain"
              textColour="white"
              text={connectUsage}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <div className="justify-self col-end-3 ">
        <button
          onClick={() => history.goBack()}
          type="button"
          className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
        >
          <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
            {' '}
          </ArrowLeftIcon>
          Back
          <span className="px-1 text-gray-400">
            {' '}
            / View {isCHW ? 'CHW' : 'User'}
          </span>
        </button>
      </div>
      {successNotification &&
        showNotification(
          'User Added Successfully! ',
          'success',
          <ThumbUpIcon className="h-10 w-10"></ThumbUpIcon>
        )}

      <div className="m-10 rounded-2xl lg:min-w-0 lg:flex-1">
        <div className="py-0 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}

          <div className="flex">
            <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 ">
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

                <div className="sm: pt-4 pl-8">
                  <p className="text-3xl font-normal text-black ">
                    {userData?.userById?.fullName ??
                      chwData?.GetHealthCareWorkerById?.user?.fullName}
                  </p>
                  <div className="flex flex-row pt-2">
                    <div className="flex items-center gap-2">
                      {getRoleStatusChip(props.location.state?.component)}
                      {isTeamLead && getConnectUsageChip(connectUsage)}
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
                                {i.name === GrowGreatRoles.HealthCareWorker
                                  ? 'CHW'
                                  : i.name}
                              </p>
                            </div>
                          );
                        }
                      )}
                  </div>
                  {/* <p>{userData?.firstName}</p> */}
                </div>
              </div>
            </div>
          </div>
          {/* End main area */}
          {!isNotLockedOut(
            userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
          ) && (
            <Alert
              className="mt-5 mb-3"
              message={`This user has been deactivated and cannot access ${data?.tenantContext.applicationName} App`}
              type="error"
            />
          )}
        </div>

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
          props.location.state?.component ===
            UsersRouteRedirectTypeEnum?.chw) &&
          isRegistered &&
          data &&
          data.tenantContext &&
          data.tenantContext.applicationName === TenantContext.GrowGreat && (
            <div className=" flex justify-end">
              <div>
                <CustomDateRangePicker
                  handleDateChange={handleDateChange}
                  selectedRange={selectedRange}
                />
              </div>
            </div>
          )}
        {(isCHW ||
          props.location.state?.component ===
            UsersRouteRedirectTypeEnum?.chw) &&
          isRegistered && (
            <HealthCareWorkerSummary
              summaryData={summaryData?.healthCareWorkerSummaryForPeriod}
            />
          )}
        {(isCHW ||
          props.location.state?.component ===
            UsersRouteRedirectTypeEnum?.chw) &&
          isRegistered && (
            <HealthCareWorkerIssues
              summaryData={summaryData?.healthCareWorkerSummaryForPeriod}
            />
          )}
        {(isCHW ||
          props.location.state?.component ===
            UsersRouteRedirectTypeEnum?.chw) &&
          isRegistered && (
            <HalthCareWorkerHighlights
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

        <div className="flex w-full justify-between  pl-4">
          <div className="flex w-10/12 flex-row  pl-4">
            {hasPermission(PermissionEnum.delete_user) &&
              isNotLockedOut(
                userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
              ) && (
                <Button
                  className={'mt-3 mr-2 w-4/12 rounded-md'}
                  type="outlined"
                  // isLoading={isLoading}
                  color="tertiary"
                  onClick={deactivateUser}
                >
                  <TrashIcon color="tertiary" className="mr-2 h-6 w-6">
                    {' '}
                  </TrashIcon>
                  <Typography
                    type="help"
                    color="tertiary"
                    text={'Deactivate User'}
                  ></Typography>
                </Button>
              )}
            {isNotLockedOut(
              userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
            ) && (
              <div className="flex w-full items-center gap-2">
                {!isRegistered && (
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
          </div>

          <div className="w-2/12">
            <p className="mt-3 w-full text-sm text-gray-600">
              User added to {data?.tenantContext.applicationName} App :{' '}
              {formatDate(
                chwData?.GetHealthCareWorkerById?.insertedDate ||
                  userData?.userById?.insertedDate
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
