import { useQuery } from '@apollo/client';
import { PermissionEnum, usePanel } from '@ecdlink/core';
import { TeamLeadDto } from '@ecdlink/core/lib/models/dto/Users/team-lead.dto';
import {
  GetAllClinic,
  GetAllProvince,
  GetAllTeamLead,
  GetSubDistrictsAndStats,
} from '@ecdlink/graphql';
import ReactDatePicker from 'react-datepicker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import { useUser } from '../../../../hooks/useUser';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  UploadIcon,
} from '@heroicons/react/solid';
import {
  ActionModal,
  Dialog,
  DialogPosition,
  Dropdown,
  SearchDropDown,
  SearchDropDownOption,
} from '@ecdlink/ui';
import debounce from 'lodash.debounce';
import { useHistory } from 'react-router';
import UiTable from './components/ui-table';
import { ConenctUsage } from './team-leads.types';
import { format } from 'date-fns';
import { Status } from '../application-admins/applications-admins.types';
import { filterByValue } from '../../../../utils/string-utils/string-utils';
import TeamLeadPanelCreate from './components/team-lead-panel-create/team-lead-panel-create';
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

export default function TeamLeads() {
  const [tableData, setTableData] = useState<any[]>([]);
  const { hasPermission } = useUser();
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [handleAdduser, setHandleAdduser] = useState(false);
  const panel = usePanel();

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
    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    history.push({
      pathname: ROUTES.VIEW_USERS,
      state: {
        component: 'team-leads',
        userId: selectedRow?.user?.id,
        teamLeadId: selectedRow?.id,
        connectUsage: selectedRow?.connectUsage,
        isRegistered: selectedRow?.isRegistered,
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

  const { data: clinicData } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: subDistrictData } = useQuery(GetSubDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

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
    if (clinicData?.GetAllClinic?.length > 0) {
      const clinicsSorted = clinicData?.GetAllClinic?.slice()?.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      );

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
  }, [clinicData?.GetAllClinic]);

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

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-8/12 sm:flex  ">
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

            <div className="mt-0 flex w-8/12 flex-row sm:mt-0 sm:ml-4">
              <div className="mx-4 ">
                <span className=" text-lg font-medium leading-6 text-gray-900">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    id="dropdownHoverButton"
                    className="bg-secondary focus:border-secondary focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
                    type="button"
                  >
                    <div className="flex gap-1">
                      Filter
                      {!showFilter ? (
                        <span>
                          <ChevronDownIcon className="h-6 w-6 text-white" />
                        </span>
                      ) : (
                        <span>
                          <ChevronUpIcon className="h-6 w-6 text-white" />
                        </span>
                      )}
                    </div>
                  </button>
                </span>
              </div>
            </div>
            <div className="ml-4 w-6/12">
              <div className="flex  flex-row">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={() => setHandleAdduser(true)}
                    type="button"
                    className="bg-secondary hover:bg-uiLight focus:outline-none ml-2 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white  focus:ring-2 focus:ring-offset-2"
                  >
                    <UploadIcon className="mr-4 h-5 w-5"> </UploadIcon>
                    Add Team Leads
                  </button>
                )}
              </div>
            </div>
          </div>
          {showFilter && (
            <div className="mb-4 flex w-full flex-row items-center">
              <div className="flex items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-0.5'}
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
                  className="mr-1 flex items-center"
                  onClick={() => setFilterDateAdded(!filterDateAdded)}
                >
                  <Dropdown
                    fillType="filled"
                    textColor={'textLight'}
                    fillColor={endDate ? 'secondary' : 'white'}
                    placeholder={dateDropdownValue || 'Date invited'}
                    labelColor={endDate ? 'white' : 'textLight'}
                    list={[]}
                    onChange={(item) => {}}
                    className="w-56 text-sm text-white"
                  />
                </div>
              )}

              {filterDateAdded && (
                <ReactDatePicker
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange={true}
                  inline
                  shouldCloseOnSelect={true}
                />
              )}
              <div className="w-6/12">
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
                  multiple={true}
                  color={'secondary'}
                />
              </div>
              <div className="w-6/12">
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
                  multiple={true}
                  color={'secondary'}
                />
              </div>
              <div className="w-6/12">
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
                  multiple={true}
                  color={'secondary'}
                />
              </div>
              <div className="mr-2 flex items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1'}
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
              <div className="flex w-full justify-end">
                <div className="">
                  <button
                    onClick={clearFilters}
                    type="button"
                    className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white "
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                  <UiTable
                    columns={[
                      { field: 'idNumber', use: 'id / Passport' },
                      { field: 'fullName', use: 'name' },
                      { field: 'connectUsage', use: 'CHW Connect uage' },
                      { field: 'insertedDate', use: 'Date Invited' },
                      { field: 'isActive', use: 'Active' },
                    ]}
                    rows={
                      searchValue !== 'Search by title or content...'
                        ? filterByValue(tableData, searchValue)
                        : tableData
                    }
                    component="team-leads"
                    viewRow={viewSelectedRow}
                    isLoading={loading}
                  />
                </div>
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
