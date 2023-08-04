import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  ClinicDto,
  NOTIFICATION,
  PermissionEnum,
  TeamLeadDto,
  UserDto,
  b64toBlob,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import debounce from 'lodash.debounce';

import { HealthCareWorkerDto } from '@ecdlink/core/lib/models/dto/Users/health-care-worker.dto';
import {
  SendInviteToApplication,
  GetAllHealthCareWorker,
  GetAllTeamLead,
  GetAllClinic,
  GetAllProvince,
  HealthCareWorkerTemplate,
  getHealthCareWorkerCount,
  SortEnumType,
  HealthCareWorkerSortInput,
} from '@ecdlink/graphql';
import {
  Button,
  DialogPosition,
  DropDownOption,
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { Fragment, useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import UploadAllImportTemplate from './components/upload-import-template/upload-import-template';
import { useUser } from '../../../../hooks/useUser';
import HealthCareWorkerPanelCreate from './components/health-care-worker-panel-create/health-care-worker-panel-create';
import { PlusIcon, SearchIcon, UploadIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';

export default function HealthCareWorkers() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const [tableData, setTableData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const history = useHistory();
  const [nameFilter, setNameFilter] = useState(false);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();
  const [statusFilter, setStatusFilter] = useState('active');
  const [teamLeadFilter, setTeamLeadFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(null);
  const [totalItemCount, setTotalItemCount] = useState(10);

  const viewSelectedRow = (selectedRow: any) => {
    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    history.push({
      pathname: '/users/view-user',
      state: {
        component: 'chw',
        userId: selectedRow?.userId,
      },
    });
  };
  const getVariables = (
    search: string,
    province: string,
    teamLead: string,
    clinic: string,
    sortDescending: boolean,
    currentPage: number,
    pageSize: number | null
  ) => {
    return {
      provinceSearch: province,
      clinicSearch: clinic,
      teamLeadSearch: teamLead,
      search: search,
      order: [
        {
          insertedDate: sortDescending ? SortEnumType.Desc : SortEnumType.Asc,
        } as HealthCareWorkerSortInput,
      ],
      pagingInput: {
        pageNumber: currentPage,
        pageSize: pageSize,
      },
    };
  };

  // TODO: fetch count when the total was implemented
  // const [getAllHealthCareWorkersCount, {data: chwCountData }] = useLazyQuery(
  //   getHealthCareWorkerCount, {
  //   fetchPolicy: 'cache-and-network',
  //   variables: {
  //     search: '',
  //     clinicSearch: '',
  //     provinceSearch: '',
  //   },
  // });

  const [getAllHealthCareWorkers, { data, refetch }] = useLazyQuery(
    GetAllHealthCareWorker,
    {
      variables: getVariables(
        searchValue,
        provinceFilter,
        clinicFilter,
        teamLeadFilter,
        sortDescending,
        currentPage,
        null
      ),
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    getAllHealthCareWorkers({
      variables: getVariables(
        searchValue,
        provinceFilter,
        clinicFilter,
        teamLeadFilter,
        sortDescending,
        currentPage,
        pageSize
      ),
      fetchPolicy: 'network-only',
    });
  }, [
    provinceFilter,
    searchValue,
    clinicFilter,
    teamLeadFilter,
    currentPage,
    pageSize,
    sortDescending,
  ]);

  const { data: teamLeadData } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: clinicData } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const teamLeads = teamLeadData?.allTeamLeads.map((x: TeamLeadDto) => {
    return {
      value: x.user.fullName,
      label: x.user.fullName,
    };
  });

  const clinics = clinicData?.GetAllClinic.map((x: ClinicDto) => {
    return {
      label: x.name,
      value: x.name,
    };
  });

  const provinces = provinceData?.GetAllProvince.map((x: any) => {
    return {
      label: x.description,
      value: x.description,
    };
  });

  const mapUserTableItem = (item: any) => {
    return {
      ...item,
      userId: item.user?.id,
      fullName: `${item.user?.fullName}`,
      isActive: item.user?.isActive,
      idNumber: item.user?.idNumber,
      dateInvited: item.user?.insertedDate,
    };
  };

  useEffect(() => {
    if (data && data.allHealthCareWorkers) {
      const copyItems = data.allHealthCareWorkers.map(
        (item: HealthCareWorkerDto) => mapUserTableItem(item)
      );
      // TODO: Move this when the UITable supports setting a length.
      setTotalItemCount(data.allHealthCareWorkers.length);
      setTableData(copyItems);
      // let userStatus = statusFilter === 'active' ? true : false;
      // setTableData(
      //   copyItems.filter((user: { isActive: boolean; }) => user.isActive === userStatus).map(mapUserTableItem)
      // );
    }
  }, [data]);

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
    setStatusFilter('');
    setClinicFilter('');
    setProvinceFilter('');
    setTeamLeadFilter('');
  };

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
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by id number or name..."
                    onChange={search}
                  />
                </div>
              </div>
            </div>

            <div className="mt-0  flex w-10/12 flex-row sm:mt-0  sm:ml-4">
              <div className="pr-2 ">
                <span className=" text-lg font-medium leading-6 text-gray-900">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    id="dropdownHoverButton"
                    className="bg-secondary focus:border-secondary focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
                    type="button"
                  >
                    Filter
                    <svg
                      className="ml-2 h-4 w-4"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </span>
              </div>

              <div className="flex w-full flex-row ">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={displayPanel}
                    type="button"
                    className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white  focus:ring-2 focus:ring-offset-2"
                  >
                    <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                    Add CHW
                  </button>
                )}
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={() => {
                      history.push('/upload-users');
                    }}
                    type="button"
                    className="bg-secondary hover:bg-uiLight focus:outline-none ml-2 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white  focus:ring-2 focus:ring-offset-2"
                  >
                    <UploadIcon className="mr-4 h-5 w-5"> </UploadIcon>
                    Bulk Upload
                  </button>
                )}
              </div>
            </div>
          </div>
          {showFilter && (
            <div className="mb-0 flex w-full flex-row flex-wrap items-center">
              <div className="relative inline-block pr-2 text-left">
                <Dropdown
                  showSearch
                  fillType="outlined"
                  fillColor="secondary"
                  placeholder="Province"
                  selectedValue={provinceFilter}
                  list={provinces}
                  onChange={(item) => {
                    setProvinceFilter(item);
                    refetch();
                  }}
                />
              </div>
              <div className="relative inline-block pr-2 text-left">
                <Dropdown
                  showSearch
                  fillType="outlined"
                  fillColor="secondary"
                  placeholder="Clinic"
                  selectedValue={clinicFilter}
                  list={clinics}
                  onChange={(item) => setClinicFilter(item)}
                />
              </div>
              <div className="relative inline-block pr-2 text-left">
                <Dropdown
                  showSearch
                  fillType="outlined"
                  textColor="white"
                  fillColor="secondary"
                  placeholder="Team Leads"
                  selectedValue={teamLeadFilter}
                  list={teamLeads || []}
                  onChange={(item) => setTeamLeadFilter(item)}
                />
              </div>

              <div>
                <Dropdown
                  fillType="filled"
                  textColor="white"
                  fillColor="secondary"
                  placeholder="Filter By Name"
                  labelColor="white"
                  selectedValue={nameFilter}
                  list={[
                    { label: 'Ascending', value: false },
                    { label: 'Descending', value: true },
                  ]}
                  onChange={(item) => {
                    setNameFilter(item);
                  }}
                  className="p-2"
                />
              </div>

              <div>
                <Dropdown
                  fillType="filled"
                  textColor="white"
                  fillColor="secondary"
                  placeholder="Filter By Status"
                  labelColor="white"
                  selectedValue={statusFilter}
                  list={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  onChange={(item) => {
                    setStatusFilter(item);
                  }}
                  className="p-2"
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

              {/* <CustomDateRangePicker handleDateChange={handleDateChange} selectedRange={selectedRange} /> */}

              <div></div>
            </div>
          )}

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'idNumber', use: 'id / Passport' },
                    { field: 'fullName', use: 'name' },
                    // { field: 'usage', use: 'CHW Connect usage' },
                    { field: 'insertedDate', use: 'Date invited' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  rows={tableData}
                  sendRow={
                    hasPermission(PermissionEnum.update_user) && sendInvite
                  }
                  searchInput={searchValue}
                  component={'chw'}
                  viewRow={viewSelectedRow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
