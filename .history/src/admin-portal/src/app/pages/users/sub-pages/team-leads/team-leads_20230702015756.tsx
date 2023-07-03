import { useLazyQuery, useQuery } from '@apollo/client';
import { ClinicDto, PermissionEnum, ProvinceDto } from '@ecdlink/core';
import { TeamLeadDto } from '@ecdlink/core/lib/models/dto/Users/team-lead.dto';
import { usePanel } from '@ecdlink/core/lib/services/panel/PanelService';
import { GetAllClinic, GetAllProvince, GetAllTeamLead } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import TeamLeadPanelCreate from './team-lead-panel-create/team-lead-panel-create';
import { PlusIcon, SearchIcon, UploadIcon } from '@heroicons/react/solid';
import { Dropdown } from '@ecdlink/ui';
import debounce from 'lodash.debounce';
import { Menu } from '@headlessui/react';
import { useHistory } from 'react-router';
export default function TeamLeads() {
  const [tableData, setTableData] = useState<any[]>([]);
  const panel = usePanel();
  const { hasPermission } = useUser();
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const history = useHistory();

  const [GetAllTeamLeads, { data, refetch }] = useLazyQuery(GetAllTeamLead, {
    variables: {
      provinceSearch: '',
      clinicSearch: '',
      textSearch: '',
      pagingInput: {
        pageNumber: 1,
        pageSize: 30,
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    GetAllTeamLeads({
      variables: {
        textSearch: searchValue,
        provinceSearch: provinceFilter,
        clinicSearch: clinicFilter,
        pagingInput: {
          pageNumber: 1,
          pageSize: 30,
        },
      },
    });
  }, [provinceFilter, searchValue, clinicFilter]);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const { data: clinicData } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const clinics = clinicData?.GetAllClinic.map((x: ClinicDto) => {
    return {
      label: x.name,
      value: x.name,
    };
  });

  const provinces = provinceData?.GetAllProvince.map((x: ProvinceDto) => {
    return {
      label: x.description,
      value: x.description,
    };
  });


  const clearFilters = () => {
    setStatusFilter('');
    setClinicFilter('');
    setProvinceFilter('');
  };

  useEffect(() => {
    if (data && data.allTeamLeads) {
      const copyItems = data.allTeamLeads.map((item: TeamLeadDto) => ({
        ...item,
        fullName: `${item.user?.fullName}`,
        isActive: item.user?.isActive,
        idNumber: item.user?.idNumber,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Team Lead',
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
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
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
            </div>
            <div className="ml-4 w-6/12">
              <div className=flex w-11/12 flex-row">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white  focus:ring-2 focus:ring-offset-2"
                >
                  <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                  Add Team Lead
                </button>
              )}
            </div>
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
                  onChange={(item) => setProvinceFilter(item)}
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
              <div>
                <Dropdown
                  fillType="filled"
                  textColor="white"
                  fillColor="secondary"
                  placeholder="Filter"
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
                      { field: 'isActive', use: 'Active' },
                    ]}
                    rows={tableData}
                    urlRow={'/view-user/'}
                    searchInput={searchValue}
                    component="team-leads"
                  />
                </div>
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
