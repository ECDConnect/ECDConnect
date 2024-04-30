import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { TeamLeadDto } from '@ecdlink/core/lib/models/dto/Users/team-lead.dto';
import {
  GetAllPortalClinics,
  GetAllProvince,
  GetAllTeamLead,
  GetSubDistrictsAndStats,
  deleteMultipleUsers,
  sentInviteToMultipleUsers,
} from '@ecdlink/graphql';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import { useUser } from '../../../../hooks/useUser';
import {
  ActionModal,
  Dialog,
  DialogPosition,
  SearchDropDownOption,
  Table,
} from '@ecdlink/ui';
import debounce from 'lodash.debounce';
import { useHistory } from 'react-router';
import { ConenctUsage } from './team-leads.types';
import { format } from 'date-fns';
import { Status } from '../application-admins/applications-admins.types';
import { filterByValue } from '../../../../utils/string-utils/string-utils';
import TeamLeadPanelCreate from './components/team-lead-panel-create/team-lead-panel-create';
import ROUTES from '../../../../routes/app.routes-constants';
import { UsersRouteRedirectTypeEnum } from '../../../view-user/view-user.types';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import { columnColor } from '../../../../utils/health-care-worker/components-utils';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';

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

export default function TeamLeads() {
  const [tableData, setTableData] = useState<any[]>([]);
  const { hasPermission } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const panel = usePanel();
  const [selectedTeamLeads, setSelectedTeamLeads] = useState<Irow[]>([]);
  const [handleAddUser, setHandleAddUser] = useState(false);
  const dialog = useDialog();
  const { setNotification } = useNotifications();

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
  >([sortByClientStatusOptions[0]]);

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const [connectUsageFilter, setConnectUsageFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredConnectUsage = useMemo(
    () => connectUsageFilter?.map((item) => item?.id),
    [connectUsageFilter]
  );

  const history = useHistory();

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
        component: UsersRouteRedirectTypeEnum.teamLeads,
        userId: selectedRow?.user?.id,
        teamLeadId: selectedRow?.id,
        connectUsage: selectedRow?.connectUsage,
        isRegistered: selectedRow?.isRegistered,
        clinicIds: selectedRow?.clinicIds,
        connectUsageColor: user?.user?.connectUsageColor,
      },
    });
  };

  const { data, refetch, loading } = useQuery(GetAllTeamLead, {
    variables: {
      search: '',
      clinicSearch: filteredClinics,
      provinceSearch: filteredProvinces,
      subDistrictSearch: filteredSubDistricts,
      visitSearch: [],
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

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

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

  const clearFilters = () => {
    setProvincesFiltered([]);
    setStatusFilter([]);
    setClinicsFiltered([]);
    setConnectUsageFilter([]);
    setSubDistrictsFiltered([]);
    setStartDate('');
    setEndDate('');
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

  useEffect(() => {
    if (data && data.allTeamLeads) {
      const copyItems = data.allTeamLeads.map((item: TeamLeadDto) => ({
        ...item,
        fullName: `${item.user?.fullName}`,
        isActive: item.user?.isActive,
        idNumber: item.user?.idNumber,
        connectUsage: item?.user?.connectUsage,
        _url: undefined,
      }));

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

  const handleSetDateFilter = useCallback(() => {
    setFilterDateAdded(!filterDateAdded);
  }, [filterDateAdded]);

  useEffect(() => {
    if (endDate) {
      handleSetDateFilter();
    }
  }, [endDate]);

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: '',
      render: (onSubmit: any) => (
        <TeamLeadPanelCreate
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

  const tableRef = useRef<TableRefMethods>(null);

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: item?.id,
        displayColumnIdPassportEmail:
          item?.user?.userName ?? item?.idNumber ?? item?.user?.email ?? '-',
        fullName: `${item?.user?.firstName} ${item?.user?.surname}`,
        connectUsageComponent: item?.user?.connectUsage
          ? columnColor(item.user.connectUsage)
          : '-',
        insertedDateFormatted: item?.insertedDate
          ? format(new Date(item?.insertedDate), 'dd/MM/yyyy')
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

  const isFilterActive =
    !!connectUsageFilter?.length ||
    !!startDate ||
    !!endDate ||
    !!clinicsFiltered?.length ||
    !!subDistrictsFiltered?.length ||
    !!provincesFiltered?.length ||
    !!statusFilter?.length;

  const noContentText = useMemo(() => {
    if (isFilterActive) {
      return 'No results found. Try changing the filters selected';
    }
    return 'No entries found';
  }, [isFilterActive]);

  const isLoading =
    loading || loadingClinics || loadingProvince || loadingDistricts;

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

  const inactiveUsers = selectedTeamLeads?.filter(
    (item) => item?.isActive === false
  );
  const disableInviteBulkAction =
    selectedTeamLeads?.length <= inactiveUsers?.length;
  const isAllInactive = selectedTeamLeads.every(
    (obj) => obj?.isActive === false
  );

  const handleResetSelectedRows = () => {
    tableRef?.current?.resetSelectedRows();
  };

  const chwIdsToSendInvitation = selectedTeamLeads
    ?.filter((item) => !item?.isRegistered && item?.user?.phoneNumber)
    ?.map((item) => item?.id);

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
          setSelectedTeamLeads([]);
          handleResetSelectedRows();
        }
        if (res.data?.sendBulkInviteToPortal?.failed.length > 0) {
          setNotification({
            title: ` Failed to Send to ${res.data?.sendBulkInviteToPortal?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedTeamLeads([]);
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

  const handleBulkInvitation = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Resend invitation to ${
            selectedTeamLeads?.length - inactiveUsers?.length
          } Team Leads?`}
          message={`Are you sure you want to send the invitation to the ${
            selectedTeamLeads?.length - inactiveUsers?.length
          } Team Leads selected?`}
          btnText={['Yes, resend', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveUsers?.length > 0}
          alertMessage={`Note: ${inactiveUsers?.length} selected Team Leads are already registered or have been deactivated so you cannot resend these invitations.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedTeamLeads([]);
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
    selectedTeamLeads?.length,
    isAllInactive,
    inactiveUsers?.length,
    inviteUsers,
  ]);

  const deactivateUser = useCallback(() => {
    deactivateUsers({
      variables: {
        ids: selectedTeamLeads?.map((item) => item?.id),
      },
    })
      .then((res) => {
        if (res.data?.bulkDeleteUser?.success.length > 0) {
          setNotification({
            title: ` Successfully Deactivated ${res.data?.bulkDeleteUser?.success.length} Users!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetch();
          setSelectedTeamLeads([]);
          handleResetSelectedRows();
        }
        if (res.data?.bulkDeleteUser?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deactivate ${res.data?.bulkDeleteUser?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedTeamLeads([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to deactivate',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateUsers, selectedTeamLeads, setNotification, refetch]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Deactivate ${
            selectedTeamLeads?.length - inactiveUsers?.length
          } Team Leads?`}
          message={`Are you sure you want to deactivate these Team Leads? Team Leads will lose their access to CHW Connect immediately. Make sure you have communicated this to Team Leads before deactivating them.`}
          btnText={['Yes, deactivate Team Leads', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveUsers?.length > 0}
          alertMessage={`Note: ${inactiveUsers?.length} Team Leads selected have already been deactivated.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedTeamLeads([]);
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
    inactiveUsers?.length,
    selectedTeamLeads?.length,
  ]);

  if (tableData) {
    return (
      <div className="bg-adminPortalBg h-full rounded-2xl p-4 ">
        <div className="rounded-xl bg-white p-12">
          <Table
            ref={tableRef}
            rows={rows}
            columns={columns}
            onClearFilters={clearFilters}
            onChangeSelectedRows={setSelectedTeamLeads}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || isLoading,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={
              hasPermission(PermissionEnum.create_user) && {
                text: 'Add Team Leads',
                onClick: () => setHandleAddUser(true),
                icon: 'PlusIcon',
              }
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
                dateFormat: 'd MMM yyyy',
                hideFilter: false,
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
                hideFilter: false,
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
                hideFilter: false,
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
                hideFilter: false,
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
            importantText={`Would you like to add one Team Lead or multiple?`}
            actionButtons={[
              {
                text: 'Add multiple Team Leads',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () =>
                  history.push({
                    pathname: ROUTES.UPLOAD_USERS,
                    state: {
                      component: 'team-leads',
                    },
                  }),
                leadingIcon: 'UsersIcon',
              },
              {
                text: 'Add one Team Lead',
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
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
