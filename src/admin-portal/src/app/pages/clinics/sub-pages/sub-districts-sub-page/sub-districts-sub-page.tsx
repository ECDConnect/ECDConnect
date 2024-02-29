import { useQuery } from '@apollo/client';
import { PermissionEnum, usePanel, ClinicDto } from '@ecdlink/core';
import debounce from 'lodash.debounce';
import {
  GetAllProvince,
  GetDistrictsAndStats,
  GetSubDistrictsAndStats,
} from '@ecdlink/graphql';
import { Dropdown, SearchDropDownOption } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
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

  const { data: provincetData } = useQuery(GetAllProvince, {
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

  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');

  const clearFilters = () => {
    setDistrict('');
    setProvince('');
  };

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (districtData?.districtsAndStats?.length > 0) {
      setDistricts(
        districtData?.districtsAndStats?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        })
      );
    }
  }, [districtData?.districtsAndStats]);

  useEffect(() => {
    if (provincetData?.GetAllProvince?.length > 0) {
      setProvinces(
        provincetData?.GetAllProvince?.map((item) => {
          return {
            value: item?.id,
            label: item?.description,
          };
        })
      );
    }
  }, [provincetData?.GetAllProvince]);

  useEffect(() => {
    if (district && districtData?.districtsAndStats?.length > 0) {
      setTableData(
        data?.subDistrictsAndStats?.filter(
          (item) => item?.district?.id === district
        )
      );
    } else {
      setTableData(data?.subDistrictsAndStats);
    }
  }, [
    district,
    data?.subDistrictsAndStats,
    districtData?.districtsAndStats?.length,
  ]);

  useEffect(() => {
    if (province && provincetData?.GetAllProvince?.length > 0) {
      setTableData(
        data?.subDistrictsAndStats?.filter(
          (item) => item?.district?.province?.id === province
        )
      );
    } else {
      setTableData(data?.subDistrictsAndStats);
    }
  }, [
    data?.subDistrictsAndStats,
    province,
    provincetData?.GetAllProvince?.length,
  ]);

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
                    <div className=" w-6/12">
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="District"
                        labelColor="white"
                        // selectedValue={district}
                        list={districts}
                        onChange={(item) => {
                          setDistrict(item);
                        }}
                        className="p-2"
                      />
                    </div>

                    <div className=" w-6/12">
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="Province"
                        labelColor="white"
                        // selectedValue={province}
                        list={provinces}
                        onChange={(item) => {
                          setProvince(item);
                        }}
                        className="p-2"
                      />
                    </div>

                    <div className="justify-self col-end-3 ">
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
                    { field: 'id', use: 'Unique ID' },
                    { field: 'name', use: 'Sub-district' },
                    { field: 'district', use: 'District' },
                    { field: `district`, use: 'Province' },
                    { field: 'insertedDate', use: 'Inserted date' },
                  ]}
                  rows={tableData}
                  // editRow={
                  //   hasPermission(PermissionEnum.update_user) &&
                  //   displayEditPanel
                  // }
                  viewRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditPanel
                  }
                  searchInput={searchValue}
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
