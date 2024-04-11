import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import debounce from 'lodash.debounce';
import { HealthCareWorkerDto } from '@ecdlink/core/lib/models/dto/Users/health-care-worker.dto';
import {
  SendInviteToApplication,
  GetAllHealthCareWorker,
  GetAllPortalClinics,
  GetAllProvince,
  GetSubDistrictsAndStats,
  sentInviteToMultipleUsers,
  deleteMultipleUsers,
} from '@ecdlink/graphql';
import {
  ActionModal,
  Dialog,
  DialogPosition,
  SearchDropDownOption,
  Table,
} from '@ecdlink/ui';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import { useUser } from '../../../../hooks/useUser';
import HealthCareWorkerPanelCreate from './components/health-care-worker-panel-create/health-care-worker-panel-create';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import { ConenctUsage } from '../team-leads/team-leads.types';
import { Status } from '../application-admins/applications-admins.types';
import { format } from 'date-fns';
import { AppVisitActivity, ConnectUsage } from './health-care-worker.types';
import { filterByValue } from '../../../../utils/string-utils/string-utils';
import ROUTES from '../../../../routes/app.routes-constants';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import { useUserRole } from '../../../../hooks/useUserRole';

export const sortByConnectUsage: SearchDropDownOption<string>[] = [
  ConenctUsage?.InvitationActive,
  ConenctUsage?.InvitationExpired,
  ConenctUsage?.LastOnlineOver6Months,
  ConenctUsage?.LastOnlineWithinPast6Months,
  ConenctUsage?.Removed,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const sortByClientStatusOptions: SearchDropDownOption<string>[] = [
  Status?.ACTIVE,
  Status?.INACTIVE,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const sortByAppActivity: SearchDropDownOption<string>[] = [
  AppVisitActivity?.High,
  AppVisitActivity?.Medium,
  AppVisitActivity?.Low,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function HealthCareWorkers() {
  const { hasPermission } = useUser();
  const { isTeamLead, isAdministrator } = useUserRole();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const [tableData, setTableData] = useState<any[]>([]);
  const history = useHistory();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();
  const [searchValue, setSearchValue] = useState('');

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [handleAddUser, setHandleAddUser] = useState(false);

  const [selectedCHWs, setSelectedCHWs] = useState<Irow[]>([]);

  const isAllInactive = selectedCHWs.every((obj) => obj?.isActive === false);

  const registeredOrInactiveUsers = selectedCHWs?.filter(
    (item) => item?.isRegistered === true || item?.isActive === false
  );
  const disableInviteBulkAction =
    selectedCHWs?.length <= registeredOrInactiveUsers?.length;

  // INFO: It’s being filtered by phoneNumber, because if the user doesn’t have the phoneNumber field filled, it’s breaking the sendInvitation mutation
  const chwIdsToSendInvitation = selectedCHWs
    ?.filter((item) => !item?.isRegistered && item?.user?.phoneNumber)
    ?.map((item) => item?.id);

  const [sendInvitations, { loading: invitationsLoading }] = useMutation(
    sentInviteToMultipleUsers,
    {
      variables: {
        userIds: [],
      },
      fetchPolicy: 'network-only',
    }
  );
  const [deactivateUsers, { loading: deactivating }] = useMutation(
    deleteMultipleUsers,
    {
      variables: {
        ids: [],
      },
      fetchPolicy: 'network-only',
    }
  );

  const tableRef = useRef<TableRefMethods>(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSetDateFilter = useCallback(() => {
    setFilterDateAdded(!filterDateAdded);
  }, [filterDateAdded]);

  useEffect(() => {
    if (endDate) {
      handleSetDateFilter();
    }
  }, [endDate]);

  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [provincesFiltered, setProvincesFiltered] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredProvinces = useMemo(
    () => provincesFiltered?.map((item) => item?.id),
    [provincesFiltered]
  );

  const [clinics, setClinics] = useState<SearchDropDownOption<string>[]>([]);
  const [clinicsFiltered, setClinicsFiltered] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredClinics = useMemo(
    () => clinicsFiltered?.map((item) => item?.label),
    [clinicsFiltered]
  );

  const [subDistricts, setSubDistricts] =
    useState<SearchDropDownOption<string>[]>();
  const [subDistrictsFiltered, setSubDistrictsFiltered] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredSubDistricts = useMemo(
    () => subDistrictsFiltered?.map((item) => item?.id),
    [subDistrictsFiltered]
  );

  const [statusFilter, setStatusFilter] = useState<
    SearchDropDownOption<string>[]
  >(isTeamLead ? [] : [sortByClientStatusOptions[0]]);

  const [connectUsageFilter, setConnectUsageFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredConnectUsage = useMemo(
    () => connectUsageFilter?.map((item) => item?.id),
    [connectUsageFilter]
  );

  const [appActivityFilter, setAppActivityFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredAppActivity = useMemo(
    () => appActivityFilter?.map((item) => item?.id),
    [appActivityFilter]
  );

  const viewSelectedRow = (selectedRow: any) => {
    const user = tableData?.find(
      (item) => item?.userId === selectedRow?.userId
    );

    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    history.push({
      pathname: ROUTES.VIEW_USERS,
      state: {
        component: 'chw',
        userId: selectedRow?.userId,
        clinicId: selectedRow?.clinicId,
        hcwId: selectedRow?.id,
        isRegistered: selectedRow?.isRegistered,
        connectUsage: selectedRow?.connectUsage,
        connectUsageColor: user?.user?.connectUsageColor,
      },
    });
  };

  const { data, refetch, loading } = useQuery(GetAllHealthCareWorker, {
    variables: {
      search: '',
      clinicSearch: filteredClinics,
      provinceSearch: filteredProvinces,
      subDistrictSearch: filteredSubDistricts,
      visitSearch: filteredAppActivity,
      connectUsageSearch: filteredConnectUsage,
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
  });

  const { data: clinicData, loading: loadingClinics } = useQuery(
    GetAllPortalClinics,
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  const { data: provinceData, loading: loadingProvince } = useQuery(
    GetAllProvince,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const { data: subDistrictData, loading: loadingDistricts } = useQuery(
    GetSubDistrictsAndStats,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const isLoading =
    loading || loadingClinics || loadingProvince || loadingDistricts;

  const noContentText = useMemo(() => {
    if (
      connectUsageFilter?.length ||
      appActivityFilter?.length ||
      startDate ||
      endDate ||
      clinicsFiltered?.length ||
      subDistrictsFiltered?.length ||
      provincesFiltered?.length ||
      statusFilter?.length
    ) {
      return 'No results found. Try changing the filters selected';
    }

    if (isTeamLead) {
      return "You don't have any CHWs yet! Contact Grow Great for more information";
    }

    return 'No entries found';
  }, [
    appActivityFilter?.length,
    clinicsFiltered?.length,
    connectUsageFilter?.length,
    endDate,
    isTeamLead,
    provincesFiltered?.length,
    startDate,
    statusFilter?.length,
    subDistrictsFiltered?.length,
  ]);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const mapUserTableItem = (item: any) => {
    return {
      ...item,
      displayColumnIdPassportEmail:
        item?.user?.userName ?? item?.idNumber ?? item?.user?.email ?? '',
      userId: item.user?.id,
      fullName: `${item.user?.fullName}`,
      isActive: item.user?.isActive,
      idNumber: item.user?.idNumber,
      dateInvited: item.user?.insertedDate,
      connectUsage: item?.user?.connectUsage,
    };
  };

  useEffect(() => {
    if (data && data.allHealthCareWorkers) {
      const copyItems = data.allHealthCareWorkers.map(
        (item: HealthCareWorkerDto) => mapUserTableItem(item)
      );

      const filteredByDateData = copyItems?.filter((d) => {
        return (
          new Date(d?.insertedDate).getTime() >=
            new Date(startDate)?.getTime() &&
          new Date(d?.insertedDate).getTime() <= new Date(endDate)?.getTime()
        );
      });

      if (startDate && endDate) {
        if (statusFilter?.length === 1) {
          if (statusFilter.some((e) => e.value === Status?.ACTIVE)) {
            const filterByStatusActive = filteredByDateData?.filter(
              (item) => item?.isActive
            );
            setTableData(filterByStatusActive);
            return;
          } else {
            const filterByStatusInactive = filteredByDateData?.filter(
              (item) => !item?.isActive
            );
            setTableData(filterByStatusInactive);
            return;
          }
        }
        setTableData(filteredByDateData);
        return;
      }

      if (statusFilter) {
        if (statusFilter?.length === 1) {
          if (statusFilter.some((e) => e.value === Status?.ACTIVE)) {
            const filterByStatusActive = copyItems?.filter(
              (item) => item?.isActive
            );
            setTableData(filterByStatusActive);
            return;
          } else {
            const filterByStatusInactive = copyItems?.filter(
              (item) => !item?.isActive
            );
            setTableData(filterByStatusInactive);
            return;
          }
        }
      }

      setTableData(copyItems);
    }
  }, [data, endDate, startDate, statusFilter]);

  // TODO: Is this function used?
  const sendInvite = async (practitioner: HealthCareWorkerDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="CHW Invite"
          message={`You are about to send an invite to ${practitioner.user.firstName} ${practitioner.user.surname}`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: practitioner.userId,
                inviteToPortal: false,
              },
            }).then(() => {
              setNotification({
                title: 'Successfully Sent CHW Invite!',
                variant: NOTIFICATION.SUCCESS,
              });
            });
          }}
        />
      ),
    });
  };

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: '',
      render: (onSubmit: any) => (
        <HealthCareWorkerPanelCreate
          key={`userPanelCreate`}
          closeDialog={(userCreated: boolean) => {
            onSubmit();

            if (userCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setConnectUsageFilter([]);
    setProvincesFiltered([]);
    setClinicsFiltered([]);
    setStartDate('');
    setEndDate('');
    setAppActivityFilter([]);
    setSubDistrictsFiltered([]);
  };

  useEffect(() => {
    if (clinicData?.allPortalClinics?.length > 0) {
      const clinicsSorted = clinicData?.allPortalClinics
        ?.slice()
        ?.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

      setClinics(
        clinicsSorted?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
            id: item?.id,
          };
        })
      );
    }
  }, [clinicData?.allPortalClinics]);

  useEffect(() => {
    if (subDistrictData?.subDistrictsAndStats?.length > 0) {
      const subDistrictSorted = subDistrictData?.subDistrictsAndStats
        ?.slice()
        ?.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      setSubDistricts(
        subDistrictSorted?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
            id: item?.id,
          };
        })
      );
    }
  }, [subDistrictData]);

  useEffect(() => {
    if (provinceData?.GetAllProvince?.length > 0) {
      const provincesSorted = provinceData?.GetAllProvince?.slice()?.sort(
        (a, b) =>
          a.description < b.description
            ? -1
            : a.description > b.description
            ? 1
            : 0
      );

      setProvinces(
        provincesSorted
          ?.filter((prov) => prov?.description !== 'N/A')
          ?.map((item) => {
            return {
              value: item?.id,
              label: item?.description,
              id: item?.id,
            };
          })
      );
    }
  }, [provinceData?.GetAllProvince]);

  const handleResetSelectedRows = () => {
    tableRef?.current?.resetSelectedRows();
  };

  const ColumnStatusIndicator = ({ icon, iconColor, text }) => (
    <div className="flex items-center gap-0.5">
      <div>
        {React.createElement(icon, { className: `${iconColor} h-5 w-5` })}
      </div>
      <span className={iconColor}>{text}</span>
    </div>
  );

  const columnColor = (value?: string) => {
    const iconMapping = {
      [ConnectUsage?.InvitationActive]: {
        icon: ClockIcon,
        color: 'text-infoMain',
      },
      [ConnectUsage?.InvitationExpired]: {
        icon: XCircleIcon,
        color: 'text-alertMain',
      },
      'Removed:': { icon: XCircleIcon, color: 'text-alertMain' },
      default: { icon: CheckCircleIcon, color: 'text-successMain' },
    };

    const firstWord = value?.split(' ')[0];
    const key = Object.hasOwn(iconMapping, value)
      ? value
      : firstWord === 'Removed:'
      ? 'Removed:'
      : 'default';
    const { icon, color } = iconMapping[key];

    return <ColumnStatusIndicator icon={icon} iconColor={color} text={value} />;
  };

  const columns: Icolumn[] = [
    {
      field: 'displayColumnIdPassportEmail',
      use: 'id / Passport',
    },
    {
      field: 'fullName',
      use: 'name',
    },
    {
      field: 'connectUsageComponent',
      use: 'CHW Connect usage',
    },
    {
      field: 'insertedDateFormatted',
      use: 'Date invited',
    },
    {
      field: 'isActiveComponent',
      use: 'Active',
    },
  ];

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        displayColumnIdPassportEmail:
          item?.user?.userName ?? item?.idNumber ?? item?.user?.email ?? '-',
        fullName: `${item?.user?.firstName} ${item?.user?.surname}`,
        connectUsageComponent: item?.user?.connectUsage
          ? columnColor(item.user.connectUsage)
          : '-',
        insertedDateFormatted: item?.user?.insertedDate
          ? format(new Date(item?.user?.insertedDate), 'dd/MM/yyyy')
          : '-',
        isActiveComponent: (
          <p
            className={
              item?.user?.isActive ? 'text-successMain' : 'text-errorMain'
            }
          >
            {item?.user?.isActive ? 'Active' : 'Inactive'}
          </p>
        ),
      })
    ) ?? [];

  // INFO: Functions from src/admin-portal/src/app/pages/users/sub-pages/health-care-worker/components/ui-table
  const inviteUsers = useCallback(() => {
    sendInvitations({
      variables: {
        userIds: chwIdsToSendInvitation,
      },
    })
      .then((res) => {
        if (res.data?.sendBulkInviteToPortal?.success.length > 0) {
          setNotification({
            title: ` Successfully Sent ${res.data?.sendBulkInviteToPortal?.success.length} Invites!`,
            variant: NOTIFICATION.SUCCESS,
          });
          setSelectedCHWs([]);
          handleResetSelectedRows();
        }
        if (res.data?.sendBulkInviteToPortal?.failed.length > 0) {
          setNotification({
            title: ` Failed to Send to ${res.data?.sendBulkInviteToPortal?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedCHWs([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to send invitations',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [chwIdsToSendInvitation, sendInvitations, setNotification]);

  const deactivateUser = useCallback(() => {
    deactivateUsers({
      variables: {
        ids: selectedCHWs?.map((item) => item?.id),
      },
    })
      .then((res) => {
        if (res.data?.bulkDeleteUser?.success.length > 0) {
          setNotification({
            title: ` Successfully Deactivated ${res.data?.bulkDeleteUser?.success.length} Users!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetch();
          setSelectedCHWs([]);
          handleResetSelectedRows();
        }
        if (res.data?.bulkDeleteUser?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deactivate ${res.data?.bulkDeleteUser?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedCHWs([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to deactivate',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateUsers, selectedCHWs, setNotification, refetch]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Deactivate ${
            selectedCHWs?.length - registeredOrInactiveUsers?.length
          } CHWs?`}
          message={`Are you sure you want to deactivate these CHWs? CHWs will lose their access to CHW Connect immediately. Make sure you have communicated this to CHWs before deactivating them.`}
          btnText={['Yes, deactivate CHWs', 'No, Cancel']}
          hasAlert={isAllInactive || registeredOrInactiveUsers?.length > 0}
          alertMessage={`Note: ${registeredOrInactiveUsers?.length} CHWs selected have already been deactivated.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedCHWs([]);
            handleResetSelectedRows();
          }}
          onSubmit={() => {
            deactivateUser();
            onClose();
          }}
        />
      ),
    });
  }, [
    deactivateUser,
    dialog,
    isAllInactive,
    registeredOrInactiveUsers?.length,
    selectedCHWs?.length,
  ]);

  const handleBulkInvitation = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Resend invitation to ${
            selectedCHWs?.length - registeredOrInactiveUsers?.length
          } CHWs?`}
          message={`Are you sure you want to send the invitation to the ${
            selectedCHWs?.length - registeredOrInactiveUsers?.length
          } CHWs selected?`}
          btnText={['Yes, resend', 'No, Cancel']}
          hasAlert={isAllInactive || registeredOrInactiveUsers?.length > 0}
          alertMessage={`Note: ${registeredOrInactiveUsers?.length} selected CHWs are already registered or have been deactivated so you cannot resend these invitations.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedCHWs([]);
            handleResetSelectedRows();
          }}
          onSubmit={() => {
            inviteUsers();
            onClose();
          }}
        />
      ),
    });
  }, [
    dialog,
    selectedCHWs?.length,
    isAllInactive,
    registeredOrInactiveUsers?.length,
    inviteUsers,
  ]);

  return (
    <>
      <div className="bg-adminPortalBg h-full rounded-2xl p-4 ">
        <div className="rounded-xl bg-white p-12">
          <Table
            ref={tableRef}
            rows={rows}
            columns={columns}
            onClearFilters={clearFilters}
            onChangeSelectedRows={setSelectedCHWs}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || isLoading,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={
              hasPermission(PermissionEnum.create_user) &&
              (!isTeamLead || isAdministrator)
                ? {
                    text: 'Add CHWs',
                    onClick: () => setHandleAddUser(true),
                    icon: 'PlusIcon',
                  }
                : undefined
            }
            search={{
              placeholder: 'Search by id number or name...',
              onChange: search,
            }}
            bulkActions={[
              {
                type: 'filled',
                color: 'secondary',
                textColor: 'white',
                text: 'Resend Invitations',
                icon: 'PaperAirplaneIcon',
                isLoading: invitationsLoading,
                disabled:
                  invitationsLoading ||
                  disableInviteBulkAction ||
                  isAllInactive,
                onClick: handleBulkInvitation,
              },
              {
                type: 'outlined',
                color: 'tertiary',
                textColor:
                  deactivating || isAllInactive ? 'uiLight' : 'tertiary',
                icon: 'TrashIcon',
                text: 'Deactivate User',
                isLoading: deactivating,
                disabled: deactivating || isAllInactive,
                onClick: handleBulkDelete,
              },
            ]}
            filters={[
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                options: sortByConnectUsage,
                selectedOptions: connectUsageFilter,
                onChange: setConnectUsageFilter,
                placeholder: 'CHW Connect usage',
                multiple: true,
                info: { name: 'CHW Connect usage:' },
              },
              {
                hideFilter: isTeamLead,
                className: 'w-64 h-11 mt-1 border-2 border-transparent',
                isFullWidth: false,
                colour: !!startDate ? 'secondary' : 'adminPortalBg',
                textColour: !!startDate ? 'white' : 'textMid',
                placeholderText: 'Date invited',
                type: 'date-picker',
                showChevronIcon: true,
                chevronIconColour: !!startDate ? 'white' : 'primary',
                hideCalendarIcon: true,
                selected: startDate,
                onChange,
                startDate,
                endDate,
                selectsRange: true,
                shouldCloseOnSelect: true,
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                options: sortByAppActivity,
                selectedOptions: appActivityFilter,
                onChange: setAppActivityFilter,
                placeholder: 'App visit activity',
                multiple: true,
                info: { name: 'App visit activity:' },
              },
              {
                type: 'search-dropdown',
                hideFilter: clinicData?.allPortalClinics?.length <= 1,
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                options: clinics,
                selectedOptions: clinicsFiltered,
                onChange: setClinicsFiltered,
                placeholder: 'Clinic',
                multiple: true,
                info: { name: 'Clinic:' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                hideFilter: isTeamLead,
                options: subDistricts,
                selectedOptions: subDistrictsFiltered,
                onChange: setSubDistrictsFiltered,
                placeholder: 'Sub-district',
                multiple: true,
                info: { name: 'Sub-district:' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                hideFilter: isTeamLead,
                options: provinces,
                selectedOptions: provincesFiltered,
                onChange: setProvincesFiltered,
                placeholder: 'Province',
                multiple: true,
                info: { name: 'Province:' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                hideFilter: isTeamLead,
                options: sortByClientStatusOptions,
                selectedOptions: statusFilter,
                onChange: setStatusFilter,
                placeholder: 'Status',
                multiple: true,
                info: { name: 'Status:' },
              },
            ]}
          />
        </div>
      </div>
      <Dialog
        className="absolute left-56 bottom-96 mb-44 w-6/12"
        stretch
        visible={handleAddUser}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="z-80"
          icon={'ExclamationCircleIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={`Would you like to add one CHW or multiple?`}
          actionButtons={[
            {
              text: 'Add multiple CHWs',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () =>
                history.push({
                  pathname: ROUTES.UPLOAD_USERS,
                }),
              leadingIcon: 'UsersIcon',
            },
            {
              text: 'Add one CHW',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => {
                displayPanel();
                setHandleAddUser(false);
              },
              leadingIcon: 'UserIcon',
            },
          ]}
        />
      </Dialog>
    </>
  );
}
