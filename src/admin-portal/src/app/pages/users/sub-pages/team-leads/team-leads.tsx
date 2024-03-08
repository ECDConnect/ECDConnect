import { useLazyQuery, useQuery } from '@apollo/client';
import { ClinicDto, PermissionEnum, ProvinceDto } from '@ecdlink/core';
import { TeamLeadDto } from '@ecdlink/core/lib/models/dto/Users/team-lead.dto';
import { usePanel } from '@ecdlink/core/lib/services/panel/PanelService';
import {
  GetAllClinic,
  GetAllProvince,
  GetAllTeamLead,
  GetAllTeamLeadAdminList,
  getTeamLeadCount,
  SortEnumType,
  TeamLeadSortInput,
} from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';

import { PlusIcon, SearchIcon, UploadIcon } from '@heroicons/react/solid';
import { Dropdown, SearchDropDown, SearchDropDownOption } from '@ecdlink/ui';
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

  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [provincesFiltered, setProvincesFiltered] =
    useState<SearchDropDownOption<string>[]>();

  const history = useHistory();
  const { data: teamCountData } = useQuery(getTeamLeadCount, {
    fetchPolicy: 'cache-and-network',
    variables: {
      search: '',
      clinicSearch: '',
      provinceSearch: '',
    },
  });

  const viewSelectedRow = (selectedRow: any) => {
    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    history.push({
      pathname: '/users/view-user',
      state: {
        component: 'team-leads',
        userId: selectedRow?.userId,
      },
    });
  };

  // const getVariables = (
  //   search: string,
  //   clinicSearch: [string],
  //   provinceSearch: [string],
  //   visitSearch: [string],
  //   currentPage: number,
  //   pageSize: number,
  //   order: [
  //     {
  //       "insertedDate": "DESC"
  //     }
  //   ]
  // ) => {
  //   return {
  //     provinceSearch: province,
  //     clinicSearch: clinic,
  //     search: search,
  //     order: [
  //       {
  //         insertedDate: sortDescending ? SortEnumType.Desc : SortEnumType.Asc,
  //       } as TeamLeadSortInput,
  //     ],
  //     pagingInput: {
  //       pageNumber: currentPage,
  //       pageSize: pageSize,
  //     },
  //   };
  // };

  const { data, refetch } = useQuery(GetAllTeamLead, {
    variables: {
      search: [],
      clinicSearch: [],
      provinceSearch: [],
      visitSearch: [],
      connectUsageSearch: [],
      pagingInput: [],
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    },
    fetchPolicy: 'network-only',
  });
  console.log({ data });
  // useEffect(() => {
  //   console.log(teamCountData);
  //   GetAllTeamLeads({
  //     variables: getVariables(
  //       searchValue,
  //       provinceFilter,
  //       clinicFilter,
  //       sortDescending,
  //       currentPage,
  //       teamCountData?.countTeamLeads
  //     ),
  //   });
  // }, [
  //   provinceFilter,
  //   searchValue,
  //   clinicFilter,
  //   sortDescending,
  //   currentPage,
  //   pageSize,
  //   teamCountData,
  // ]);

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

  const clearFilters = () => {
    setStatusFilter('');
    setClinicFilter('');
    setProvinceFilter('');
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
            <div className="ml-4 w-6/12">
              <div className="flex  flex-row">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={() => {
                      history.push({
                        pathname: '/upload-users',
                        state: {
                          component: 'team-leads',
                        },
                      });
                    }}
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
              {/* <div className="relative inline-block pr-2 text-left">
                <Dropdown
                  showSearch
                  fillType="outlined"
                  fillColor="secondary"
                  placeholder="Province"
                  selectedValue={provinceFilter}
                  list={provinces}
                  onChange={(item) => setProvinceFilter(item)}
                />
              </div> */}
              <div className=" w-6/12">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1'}
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
                      { field: 'insertedDate', use: 'Date Invited' },
                      { field: 'isActive', use: 'Active' },
                    ]}
                    rows={tableData}
                    searchInput={searchValue}
                    component="team-leads"
                    viewRow={viewSelectedRow}
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
