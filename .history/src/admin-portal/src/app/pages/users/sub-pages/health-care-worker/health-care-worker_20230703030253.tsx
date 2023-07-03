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
import {
  ChevronDownIcon,
  CogIcon,
  DownloadIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  UploadIcon,
} from '@heroicons/react/solid';
import HealthCareWorkerPanelEdit from './components/health-care-worker-panel-edit/hcw-panel-edit';
import UploadPractitionerTemplate from './components/upload-template/upload-template';
import { Menu, Transition } from '@headlessui/react';
import { useHistory } from 'react-router';

export default function HealthCareWorkers() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const [tableData, setTableData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const history = useHistory();

  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();
  const [statusFilter, setStatusFilter] = useState('active');
  const [teamLeadFilter, setTeamLeadFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [showDropDownFilter, setShowDropDownFilter] = useState(false);

  const [getAllHealthCareWorkers, { data, refetch }] = useLazyQuery(
    GetAllHealthCareWorker,
    {
      variables: {
        provinceSearch: '',
        clinicSearch: '',
        search: '',
        pagingInput: {
          pageNumber: 1,
          pageSize: 20,
        },
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    getAllHealthCareWorkers({
      variables: {
        search: searchValue,
        provinceSearch: provinceFilter,
        clinicSearch: clinicFilter,
        pagingInput: {
          pageNumber: 1,
          pageSize: 20,
        },
      },
    });
  }, [provinceFilter, searchValue, clinicFilter]);

  const { data: teamLeadData } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: clinicData } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const [getExcelTemplateGenerator, { data: templateData }] = useLazyQuery(
    HealthCareWorkerTemplate,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

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
      fullName: `${item.user?.fullName}`,
      isActive: item.user?.isActive,
      idNumber: item.user?.idNumber,
      _view: undefined,
      _edit: undefined,
      _url: undefined,
    };
  };


  useEffect(() => {
    let userStatus = statusFilter === 'active' ? true : false;

    if (data && data.allHealthCareWorkers) {
      const copyItems = data.allHealthCareWorkers.filter(
        (v: { isActive: boolean; }) => v?.isActive === userStatus
      ).map(
        (item: HealthCareWorkerDto) => mapUserTableItem(item)
      );
      setTableData(copyItems);
    }
  }, [data]);

  const sendInvite = async (practitioner: HealthCareWorkerDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Health Worker Invite"
          message={`You are about to send an invite to ${practitioner.user.firstName} ${practitioner.user.surname}`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: practitioner.userId,
              },
            }).then(() => {
              setNotification({
                title: 'Successfully Sent Health Worker Invite!',
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
      title: 'Create Health Worker',
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </span>
              </div>

              <div className="ml-4 w-6/12"></div>
              <div className="flex w-11/12 flex-row ">
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
            <div className="mb-4 flex w-full flex-row items-center">
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
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowDropDownFilter(!showDropDownFilter)}
                      className={`border-secondary inline-flex w-full justify-center gap-x-1.5 rounded-md border-2 px-3 py-2 text-sm font-normal ${!showDropDownFilter
                          ? 'bg-secondary text-white'
                          : 'text-secondary border-secondary border-2 bg-white'
                        } hover:text-secondary hover:bg-white `}
                      id="menu-button"
                      aria-expanded={showDropDownFilter}
                      aria-haspopup={showDropDownFilter}
                    >
                      {statusFilter === '' ? 'Status' : statusFilter}
                      <svg
                        className={`-mr-1 h-5 w-5 hover:text-white ${!showDropDownFilter
                            ? 'hover:text-secondary text-white'
                            : 'text-secondary hover:text-white'
                          }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  {/*  */}
                  {showDropDownFilter && (
                    <div
                      className="focus:outline-none absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      role="menu"
                      aria-orientation="horizontal"
                      aria-labelledby="menu-button"
                    >
                      <div className="py-1" role="none">
                        {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                        <a
                          onClick={() => {
                            setStatusFilter('active');
                            setShowDropDownFilter(!showDropDownFilter);
                          }}
                          className=" focus:bg-secondary block cursor-auto px-4 py-2 text-sm text-gray-700 focus:text-white"
                          role="menuitem"
                          id="menu-item-0"
                        >
                          Active
                        </a>
                        <a
                          onClick={() => {
                            setStatusFilter('inactive');
                            setShowDropDownFilter(!showDropDownFilter);
                          }}
                          className="focus:bg-secondary block cursor-auto px-4 py-2 text-sm text-gray-700 focus:text-white"
                          role="menuitem"
                          id="menu-item-1"
                        >
                          Inactive
                        </a>
                      </div>
                    </div>
                  )}
                </div>
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

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'idNumber', use: 'id / Passport' },
                    { field: 'fullName', use: 'name' },
                    // { field: 'usage', use: 'CHW Connect usage' },
                    { field: 'InsertedDate', use: 'Date invited' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  rows={tableData}
                  sendRow={
                    hasPermission(PermissionEnum.update_user) && sendInvite
                  }
                  searchInput={searchValue}
                  viewRow={true}
                  urlRow={'/view-user/'}
                  component={'chw'}
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
