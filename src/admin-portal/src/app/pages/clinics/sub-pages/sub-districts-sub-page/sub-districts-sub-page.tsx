import { useQuery } from '@apollo/client';
import { PermissionEnum, usePanel, ClinicDto } from '@ecdlink/core';
import debounce from 'lodash.debounce';
import {
  GetAllProvince,
  GetDistrictsAndStats,
  GetSubDistrictsAndStats,
} from '@ecdlink/graphql';
import { SearchDropDown, SearchDropDownOption } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import { SearchIcon } from '@heroicons/react/solid';
import { CreateEditSubDistrictPanel } from '../../components/create-sub-district-panel/create-edit-sub-district-panel';

export default function SubDistrictsSubPage() {
  const { hasPermission } = useUser();
  const { data, refetch } = useQuery(GetSubDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: districtData } = useQuery(GetDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const [searchValue, setSearchValue] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [districts, setDistricts] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [provincesFiltered, setProvincesFiltered] =
    useState<SearchDropDownOption<string>[]>();

  const filteredProvinces = useMemo(
    () => provincesFiltered?.map((item) => item?.id),
    [provincesFiltered]
  );

  const provincesFilteredArray = useMemo(
    () =>
      data?.subDistrictsAndStats?.filter((el) => {
        return filteredProvinces?.some((prov) => {
          return prov === el?.district?.province?.id;
        });
      }),
    [data?.subDistrictsAndStats, filteredProvinces]
  );

  const [districtsFiltered, setdistrictsFiltered] =
    useState<SearchDropDownOption<string>[]>();

  const clearFilters = () => {
    setdistrictsFiltered([]);
    setProvincesFiltered([]);
  };

  const districtsFilteredArray = useMemo(
    () =>
      data?.subDistrictsAndStats?.filter((el) => {
        return districtsFiltered?.some((dis) => {
          return dis?.id === el?.district?.id;
        });
      }),
    [data?.subDistrictsAndStats, districtsFiltered]
  );

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (districtData?.districtsAndStats?.length > 0) {
      setDistricts(
        districtData?.districtsAndStats?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
            id: item?.id,
          };
        })
      );
    }
  }, [districtData?.districtsAndStats]);

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
    if (data && data.subDistrictsAndStats) {
      const copyItems = data.subDistrictsAndStats?.map((item: ClinicDto) => ({
        ...item,
        id: `${item?.id}`,
        name: item?.name,
        isActive: item?.isActive,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  useEffect(() => {
    if (districtsFiltered?.length > 0) {
      const subDistrictsFilteredAndSorted = districtsFilteredArray
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );
      setTableData(subDistrictsFilteredAndSorted);
    } else {
      const subDistrictsFilteredAndSorted = data?.subDistrictsAndStats
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );
      setTableData(subDistrictsFilteredAndSorted);
    }
  }, [data?.subDistrictsAndStats, districtsFiltered, districtsFilteredArray]);

  useEffect(() => {
    if (provincesFiltered?.length > 0) {
      const subDistrictsFilteredAndSorted = provincesFilteredArray
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );
      setTableData(subDistrictsFilteredAndSorted);
    } else {
      const subDistrictsFilteredAndSorted = data?.subDistrictsAndStats
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );
      setTableData(subDistrictsFilteredAndSorted);
    }
  }, [data?.subDistrictsAndStats, provincesFiltered, provincesFilteredArray]);

  const panel = usePanel();
  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Add a sub-district',
      render: (onSubmit: any) => (
        <CreateEditSubDistrictPanel
          key={`subDistrictPanelCreate`}
          closeDialog={(subDistrictCreated: boolean) => {
            onSubmit();

            if (subDistrictCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const displayEditPanel = (subDistrict) => {
    panel({
      noPadding: true,
      title: 'Edit a sub-district',
      render: (onSubmit: any) => (
        <CreateEditSubDistrictPanel
          key={`subDistricthPanelEdit`}
          closeDialog={(districtCreated: boolean) => {
            onSubmit();

            refetch();
            if (districtCreated) {
              refetch();
            }
          }}
          isEdit={true}
          subDistrict={subDistrict}
        />
      ),
    });
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const filterByValue = useCallback((array, value) => {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }, []);

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-8/12 sm:flex  sm:justify-around">
              <div className="text-body w-8/12 flex-col sm:flex sm:justify-around">
                <div className="relative w-full">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="         Search by sub-district name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="mt-4 flex flex-row items-center justify-between sm:mt-6">
                    <div className="flex gap-2">
                      <div className=" w-6/12">
                        <SearchDropDown<string>
                          displayMenuOverlay={true}
                          className={'overflowx-scroll mr-1 truncate'}
                          menuItemClassName={
                            'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                          }
                          overlayTopOffset={'120'}
                          options={districts}
                          selectedOptions={districtsFiltered}
                          onChange={setdistrictsFiltered}
                          placeholder={'District'}
                          multiple={true}
                          color={'secondary'}
                        />
                      </div>

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
                    </div>

                    <div className="justify-self z-20 col-end-3">
                      <button
                        onClick={clearFilters}
                        type="button"
                        className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white  "
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mx-4 w-3/12">
                <span className="w-full text-lg font-medium leading-6 text-gray-900">
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
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  + Add a sub-district
                </button>
              )}
            </div>
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'name', use: 'Sub-district' },
                    { field: 'district', use: 'District' },
                    { field: `district`, use: 'Province' },
                    { field: 'insertedDate', use: 'Date added' },
                  ]}
                  rows={
                    searchValue !== 'Search by title or content...'
                      ? filterByValue(tableData, searchValue)
                      : tableData
                  }
                  viewRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditPanel
                  }
                  noBulkSelection={true}
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
