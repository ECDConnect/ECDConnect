import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  PractitionerDto,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import debounce from 'lodash.debounce';
import {
  SendInviteToApplication,
  GetAllProvince,
  sentInviteToMultipleUsers,
  deleteMultipleUsers,
  GetAllPortalPractitioners,
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
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';

import { filterByValue } from '../../../../utils/string-utils/string-utils';
import ROUTES from '../../../../routes/app.routes-constants';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import {
  ColumnNames,
  PractionerRouteState,
  PractitionersRouteState,
  UserSearch,
} from './practitioner.types';
import { ConnectUsage, PractionerType, Status } from '../../user.types';
import PractitionerPanelCreate from './components/practitioner-panel-create/practitioner-panel-create';
import { columnColor } from '../../../../utils/app-usage/app-usage-utils';
import { useTenant } from '../../../../hooks/useTenant';
import { UsersRouteRedirectTypeEnum } from '../../../view-user/view-user.types';

export const oaSortByConnectUsage: SearchDropDownOption<string>[] = [
  ConnectUsage?.LastOnlineOver6Months,
  ConnectUsage?.LastOnlineWithinPast6Months,
  ConnectUsage?.Removed,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const wlSortByConnectUsage: SearchDropDownOption<string>[] = [
  ConnectUsage?.InvitationActive,
  ConnectUsage?.InvitationExpired,
  ConnectUsage?.LastOnlineOver6Months,
  ConnectUsage?.LastOnlineWithinPast6Months,
  ConnectUsage?.SmsFailedAuthentication,
  ConnectUsage?.SmsFailedConnection,
  ConnectUsage?.SmsFailedInsufficientCredits,
  ConnectUsage?.SmsFailedOptedOut,
  ConnectUsage?.Removed,
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

export const sortByPractitionerTypeOptions: SearchDropDownOption<string>[] = [
  PractionerType?.PRACTITIONER,
  PractionerType?.PRINCIPAL,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function Practitioners() {
  const tenant = useTenant();
  const { hasPermission } = useUser();
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
  const location = useLocation<PractionerRouteState>();
  const [selectedUsers, setSelectedUsers] = useState<Irow[]>([]);

  const isAllInactive = selectedUsers.every((obj) => obj?.isActive === false);

  const registeredOrInactiveUsers = selectedUsers?.filter(
    (item) => item?.isRegistered === true || item?.isActive === false
  );
  const inactiveUsers = selectedUsers?.filter(
    (item) => item?.isActive === false
  );
  const disableInviteBulkAction =
    selectedUsers?.length <= registeredOrInactiveUsers?.length;

  // INFO: It’s being filtered by phoneNumber, because if the user doesn’t have the phoneNumber field filled, it’s breaking the sendInvitation mutation
  const userIdsToSendInvitation = selectedUsers
    ?.filter((item) => !item?.isRegistered && item?.user?.phoneNumber)
    ?.map((item) => item?.userId);

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

  const [practitionerTypeFiltered, setPractitionerTypeFiltered] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredPractitionerTypes = useMemo(
    () => practitionerTypeFiltered?.map((item) => item?.id),
    [practitionerTypeFiltered]
  );

  const [statusFilter, setStatusFilter] = useState<
    SearchDropDownOption<string>[]
  >([sortByClientStatusOptions[0]]);

  const [connectUsageFilter, setConnectUsageFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredConnectUsage = useMemo(
    () => connectUsageFilter?.map((item) => item?.id),
    [connectUsageFilter]
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
      pathname: ROUTES.USERS.VIEW_USER,
      state: {
        component: selectedRow?.isPrincipal
          ? UsersRouteRedirectTypeEnum.principal
          : UsersRouteRedirectTypeEnum.practitioner,
        userId: selectedRow?.userId,
        clinicId: selectedRow?.clinicId,
        practitionerUserId: selectedRow?.userId,
        isRegistered: selectedRow?.isRegistered,
        connectUsage: user?.user?.connectUsage,
        connectUsageColor: user?.user?.connectUsageColor,
      },
    });
  };

  const queryVariables = useMemo(
    () => ({
      search: '',
      provinceSearch: filteredProvinces,
      connectUsageSearch: filteredConnectUsage,
      practitionerTypeSearch: filteredPractitionerTypes,
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    }),
    [filteredConnectUsage, filteredPractitionerTypes, filteredProvinces]
  );

  const { data, refetch, loading } = useQuery(GetAllPortalPractitioners, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    history.replace({
      pathname: location.pathname,
      state: { queryVariables: queryVariables } as PractitionersRouteState,
    });
  }, [history, location.pathname, queryVariables]);

  const { data: provinceData, loading: loadingProvince } = useQuery(
    GetAllProvince,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const isLoading = loading || loadingProvince;

  const isFilterActive =
    !!connectUsageFilter?.length ||
    !!startDate ||
    !!endDate ||
    !!provincesFiltered?.length ||
    !!practitionerTypeFiltered?.length ||
    !!statusFilter?.length;

  const noContentText = useMemo(() => {
    if (isFilterActive) {
      return 'No results found. Try changing the filters selected';
    }
    return 'No entries found';
  }, [isFilterActive]);

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
    if (data && data.allPortalPractitioners) {
      const copyItems = data.allPortalPractitioners.map(
        (item: PractitionerDto) => mapUserTableItem(item)
      );

      const filteredByDateData = copyItems?.filter((d) => {
        return (
          new Date(d?.user.insertedDate).getTime() >=
            new Date(startDate)?.getTime() &&
          new Date(d?.user.insertedDate).getTime() <=
            new Date(endDate)?.getTime()
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

  // const sendInvite = async (practitioner: PractitionerDto) => {
  //   dialog({
  //     position: DialogPosition.Middle,
  //     render: (onSubmit: any, onCancel: any) => (
  //       <AlertModal
  //         title="Practitioner Invite"
  //         message={`You are about to send an invite to ${practitioner.user.firstName} ${practitioner.user.surname}`}
  //         onCancel={onCancel}
  //         onSubmit={() => {
  //           onSubmit();
  //           sendInviteToApplication({
  //             variables: {
  //               userId: practitioner.userId,
  //               inviteToPortal: false,
  //             },
  //           }).then(() => {
  //             setNotification({
  //               title: 'Successfully Sent CHW Invite!',
  //               variant: NOTIFICATION.SUCCESS,
  //             });
  //           });
  //         }}
  //       />
  //     ),
  //   });
  // };

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: '',
      overlay: true,
      render: (onSubmit: any) => (
        <PractitionerPanelCreate
          practitioners={data?.allPortalPractitioners}
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
    setPractitionerTypeFiltered([]);
    setStartDate('');
    setEndDate('');
  };

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

  const columns: Icolumn[] = [
    {
      field: 'displayColumnIdPassportEmail',
      use: ColumnNames.IdPassport,
    },
    {
      field: 'fullName',
      use: ColumnNames.Name,
    },
    {
      field: 'connectUsageComponent',
      use: ColumnNames.Usage,
    },
    {
      field: 'insertedDateFormatted',
      use: ColumnNames.Date,
    },
    {
      field: 'isActiveComponent',
      use: ColumnNames.Status,
    },
  ];

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: item?.id,
        displayColumnIdPassportEmail:
          item?.user?.userName ?? item?.idNumber ?? '-',
        fullName: `${item?.user?.firstName} ${item?.user?.surname}`,
        connectUsageComponent: item?.user?.connectUsage
          ? columnColor(item.user.connectUsage, item.user.connectUsageColor)
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

  const inviteUsers = useCallback(() => {
    sendInvitations({
      variables: {
        userIds: userIdsToSendInvitation,
      },
    })
      .then((res) => {
        if (res.data?.sendBulkInviteToPortal?.success.length > 0) {
          setNotification({
            title: ` Successfully Sent ${res.data?.sendBulkInviteToPortal?.success.length} Invites!`,
            variant: NOTIFICATION.SUCCESS,
          });
          setSelectedUsers([]);
          handleResetSelectedRows();
        }
        if (res.data?.sendBulkInviteToPortal?.failed.length > 0) {
          setNotification({
            title: ` Failed to Send to ${res.data?.sendBulkInviteToPortal?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedUsers([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to send invitations',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [userIdsToSendInvitation, sendInvitations, setNotification]);

  const deactivateUser = useCallback(() => {
    deactivateUsers({
      variables: {
        ids: selectedUsers?.map((item) => item?.userId),
      },
    })
      .then((res) => {
        if (res.data?.bulkDeleteUser?.success.length > 0) {
          setNotification({
            title: ` Successfully Deactivated ${res.data?.bulkDeleteUser?.success.length} Users!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetch();
          setSelectedUsers([]);
          handleResetSelectedRows();
        }
        if (res.data?.bulkDeleteUser?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deactivate ${res.data?.bulkDeleteUser?.failed.length} Users!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedUsers([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to deactivate',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateUsers, selectedUsers, setNotification, refetch]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Deactivate ${
            selectedUsers?.length - inactiveUsers?.length
          } Practitioners?`}
          message={`Are you sure you want to deactivate these Practitioners? Practitioners will lose their access to the app immediately. Make sure you have communicated this to Practitioners before deactivating them.`}
          btnText={['Yes, deactivate Practitioners', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveUsers?.length > 0}
          alertMessage={`Note: ${inactiveUsers?.length} Practitioners selected have already been deactivated.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedUsers([]);
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
    inactiveUsers?.length,
    isAllInactive,
    selectedUsers?.length,
  ]);

  const handleBulkInvitation = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Resend invitation to ${
            selectedUsers?.length - registeredOrInactiveUsers?.length
          } Practitioners?`}
          message={`Are you sure you want to send the invitation to the ${
            selectedUsers?.length - registeredOrInactiveUsers?.length
          } Practitioners selected?`}
          btnText={['Yes, resend', 'No, Cancel']}
          hasAlert={isAllInactive || registeredOrInactiveUsers?.length > 0}
          alertMessage={`Note: ${registeredOrInactiveUsers?.length} selected Practitioners are already registered or have been deactivated so you cannot resend these invitations.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedUsers([]);
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
    selectedUsers?.length,
    isAllInactive,
    registeredOrInactiveUsers?.length,
    inviteUsers,
  ]);

  return (
    <>
      <div className="bg-adminPortalBg h-full rounded-2xl p-4 ">
        <div className="rounded-xl bg-white p-12">
          <Table
            watchMode={true}
            ref={tableRef}
            rows={rows}
            columns={columns}
            onClearFilters={clearFilters}
            onChangeSelectedRows={setSelectedUsers}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || isLoading,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={
              hasPermission(PermissionEnum.create_user) && !tenant.isOpenAccess
                ? {
                    text: 'Add Practitioners',
                    onClick: () => setHandleAddUser(true),
                    icon: 'PlusIcon',
                  }
                : undefined
            }
            search={{
              placeholder: UserSearch.SearchBy,
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
                options: tenant.isWhiteLabel
                  ? wlSortByConnectUsage
                  : oaSortByConnectUsage,
                selectedOptions: connectUsageFilter,
                onChange: setConnectUsageFilter,
                placeholder: ColumnNames.Usage,
                multiple: true,
                info: { name: ColumnNames.Usage + ':' },
              },
              {
                dateFormat: 'd MMM yyyy',
                className: 'w-64 h-11 mt-1 border-2 border-transparent',
                isFullWidth: false,
                colour: !!startDate ? 'secondary' : 'adminPortalBg',
                textColour: !!startDate ? 'white' : 'textMid',
                placeholderText: tenant.isWhiteLabel
                  ? 'Date invited'
                  : 'Date added',
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
                options: sortByClientStatusOptions,
                selectedOptions: statusFilter,
                onChange: setStatusFilter,
                placeholder: 'Status',
                multiple: true,
                info: { name: 'Status:' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                options: sortByPractitionerTypeOptions,
                selectedOptions: practitionerTypeFiltered,
                onChange: setPractitionerTypeFiltered,
                placeholder: 'Practitioner Type',
                multiple: true,
                info: { name: 'Practitioner Type:' },
              },
            ]}
          />
        </div>
      </div>
      <Dialog
        className="absolute left-56 bottom-96 h-96 w-6/12"
        stretch
        visible={handleAddUser}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="z-80"
          icon={'ExclamationCircleIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={`Would you like to add one Practitioner or multiple?`}
          actionButtons={[
            {
              text: 'Add multiple Practitioners',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () =>
                history.push({
                  pathname: ROUTES.UPLOAD_USERS,
                  state: { component: 'practitioners' },
                }),
              leadingIcon: 'UsersIcon',
            },
            {
              text: 'Add one Practitioner',
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
