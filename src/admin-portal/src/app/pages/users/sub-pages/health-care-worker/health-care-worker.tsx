import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import debounce from 'lodash.debounce';
import ReactDatePicker from 'react-datepicker';
import { HealthCareWorkerDto } from '@ecdlink/core/lib/models/dto/Users/health-care-worker.dto';
import {
  SendInviteToApplication,
  GetAllHealthCareWorker,
  GetAllPortalClinics,
  GetAllProvince,
  GetSubDistrictsAndStats,
} from '@ecdlink/graphql';
import {
  ActionModal,
  Dialog,
  DialogPosition,
  Dropdown,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import { useUser } from '../../../../hooks/useUser';
import HealthCareWorkerPanelCreate from './components/health-care-worker-panel-create/health-care-worker-panel-create';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  SearchIcon,
  UploadIcon,
} from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import UiTable from './components/ui-table';
import { ConenctUsage } from '../team-leads/team-leads.types';
import { Status } from '../application-admins/applications-admins.types';
import { format } from 'date-fns';
import { AppVisitActivity } from './health-care-worker.types';
import { filterByValue } from '../../../../utils/string-utils/string-utils';
import ROUTES from '../../../../routes/app.routes-constants';

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
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const [tableData, setTableData] = useState<any[]>([]);
  const history = useHistory();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [handleAdduser, setHandleAdduser] = useState(false);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const dateDropdownValue = useMemo(
    () =>
      startDate && endDate
        ? `${format(startDate, 'd MMM yy')} - ${format(endDate, 'd MMM yy')}`
        : '',
    [endDate, startDate]
  );

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
  >([sortByClientStatusOptions[0]]);

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

  const { data: clinicData } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: subDistrictData } = useQuery(GetSubDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

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

  const hasDateFilter = useMemo(() => (!startDate ? 0 : 1), [startDate]);
  const numberOfFilters = useMemo(
    () =>
      statusFilter?.length +
      connectUsageFilter?.length +
      provincesFiltered?.length +
      clinicsFiltered?.length +
      appActivityFilter?.length +
      subDistrictsFiltered?.length +
      hasDateFilter,
    [
      statusFilter?.length,
      connectUsageFilter?.length,
      provincesFiltered?.length,
      clinicsFiltered?.length,
      appActivityFilter?.length,
      subDistrictsFiltered?.length,
      hasDateFilter,
    ]
  );

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

  const renderFilterButtonText = useMemo(() => {
    if (numberOfFilters) {
      if (numberOfFilters === 1) {
        return `${numberOfFilters} Filter`;
      }
      return `${numberOfFilters} Filters`;
    }

    return 'Filter';
  }, [numberOfFilters]);

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-full sm:flex  ">
              <div className="text-body w-full flex-col sm:flex sm:justify-around">
                <div className="relative w-full">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="focus:outline-none sm:text-md block w-full rounded-md bg-white py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by id number or name..."
                    onChange={search}
                  />
                </div>
              </div>
            </div>

            <div className="mt-0  flex w-10/12 justify-between sm:mt-0  sm:ml-4">
              <div className="pr-2 ">
                <span className=" text-lg font-medium leading-6 text-gray-900">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    id="dropdownHoverButton"
                    className={`${
                      numberOfFilters
                        ? ' bg-secondary'
                        : 'border-secondary border-2 bg-white'
                    } focus:border-secondary focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                      numberOfFilters ? 'text-white' : 'text-textMid'
                    } hover:bg-gray-300 focus:ring-2`}
                    type="button"
                  >
                    <div className="flex items-center gap-1">
                      <Typography
                        className="truncate"
                        type="help"
                        color={numberOfFilters ? 'white' : 'textLight'}
                        text={renderFilterButtonText}
                      />
                      {!showFilter ? (
                        <span>
                          <ChevronDownIcon
                            className={`h-6 w-6 ${
                              numberOfFilters ? 'text-white' : 'text-textLight'
                            }`}
                          />
                        </span>
                      ) : (
                        <span>
                          <ChevronUpIcon
                            className={`h-6 w-6 ${
                              numberOfFilters ? 'text-white' : 'text-textLight'
                            }`}
                          />
                        </span>
                      )}
                    </div>
                  </button>
                </span>
              </div>
              <div>
                <div className="flex w-full">
                  {hasPermission(PermissionEnum.create_user) && (
                    <button
                      onClick={() => setHandleAdduser(true)}
                      type="button"
                      className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white  focus:ring-2 focus:ring-offset-2"
                    >
                      <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                      Add CHWs
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showFilter && (
            <div className="mb-4 grid auto-cols-min grid-cols-5 items-center">
              <div className="flex w-full items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-0.5 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={sortByConnectUsage}
                  selectedOptions={connectUsageFilter}
                  onChange={setConnectUsageFilter}
                  placeholder={'CHW Connect usage'}
                  multiple={true}
                  color={'secondary'}
                  info={{
                    name: `CHW Connect usage:`,
                  }}
                />
              </div>
              {!filterDateAdded && (
                <div
                  onClick={() => setFilterDateAdded(!filterDateAdded)}
                  className="mr-1"
                >
                  <Dropdown
                    fillType="filled"
                    textColor={'textLight'}
                    fillColor={endDate ? 'secondary' : 'white'}
                    placeholder={dateDropdownValue || 'Date invited'}
                    labelColor={endDate ? 'white' : 'textLight'}
                    list={[]}
                    onChange={(item) => {}}
                    className="w-full text-sm text-white"
                  />
                </div>
              )}

              {filterDateAdded && (
                <div>
                  <ReactDatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange={true}
                    inline
                    shouldCloseOnSelect={true}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-0.5 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={sortByAppActivity}
                  selectedOptions={appActivityFilter}
                  onChange={setAppActivityFilter}
                  placeholder={'App activity'}
                  multiple={true}
                  color={'secondary'}
                  info={{
                    name: `App activity:`,
                  }}
                />
              </div>
              <div className="w-full">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={clinics}
                  selectedOptions={clinicsFiltered}
                  onChange={setClinicsFiltered}
                  placeholder={'Clinic'}
                  info={{
                    name: `Clinic:`,
                  }}
                  multiple={true}
                  color={'secondary'}
                />
              </div>
              <div className="w-full">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={subDistricts}
                  selectedOptions={subDistrictsFiltered}
                  onChange={setSubDistrictsFiltered}
                  placeholder={'Sub-district'}
                  info={{
                    name: `Sub-district:`,
                  }}
                  multiple={true}
                  color={'secondary'}
                />
              </div>
              <div className="w-full">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={provinces}
                  selectedOptions={provincesFiltered}
                  onChange={setProvincesFiltered}
                  placeholder={'Province'}
                  info={{
                    name: `Province:`,
                  }}
                  multiple={true}
                  color={'secondary'}
                />
              </div>
              <div className="mr-2 flex items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={sortByClientStatusOptions}
                  selectedOptions={statusFilter}
                  onChange={setStatusFilter}
                  placeholder={'Status'}
                  multiple={true}
                  color={'secondary'}
                  info={{
                    name: `Status:`,
                  }}
                />
              </div>

              <div className=" flex-end flex">
                <button
                  onClick={clearFilters}
                  type="button"
                  className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white "
                >
                  Clear All
                </button>
              </div>
              <div></div>
            </div>
          )}

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    {
                      field: 'displayColumnIdPassportEmail',
                      use: 'id / Passport',
                    },
                    { field: 'fullName', use: 'name' },
                    { field: 'connectUsage', use: 'CHW Connect usage' },
                    { field: 'insertedDate', use: 'Date invited' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  rows={
                    searchValue !== 'Search by title or content...'
                      ? filterByValue(tableData, searchValue)
                      : tableData
                  }
                  sendRow={
                    hasPermission(PermissionEnum.update_user) && sendInvite
                  }
                  component={'chw'}
                  viewRow={viewSelectedRow}
                  isLoading={loading}
                  refetchData={refetch}
                />
              </div>
            </div>
          </div>
        </div>
        <Dialog
          className="absolute left-56 bottom-96 mb-44 w-6/12"
          stretch
          visible={handleAdduser}
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
                  setHandleAdduser(false);
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
