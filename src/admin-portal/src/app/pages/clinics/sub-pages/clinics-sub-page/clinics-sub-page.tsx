import { useQuery } from '@apollo/client';
import { PermissionEnum, usePanel, ClinicDto } from '@ecdlink/core';
import debounce from 'lodash.debounce';
import { GetAllPortalClinics, GetSubDistrictsAndStats } from '@ecdlink/graphql';
import { SearchDropDown, SearchDropDownOption } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import { SearchIcon } from '@heroicons/react/solid';
import { CreateClinicPanel } from '../../components/create-clinic-panel/create-edit-clinic-panel';
import { useHistory } from 'react-router';
import { AdminTypes } from '../../../users/sub-pages/application-admins/applications-admins.types';
import { useUserRole } from '../../../../hooks/useUserRole';

export default function ClinicsSubPage() {
  const { hasPermission, user } = useUser();
  const { isAdministrator, isSuperAdmin } = useUserRole();
  const { data, refetch } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: subDistrictsData } = useQuery(GetSubDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const history = useHistory();

  const [searchValue, setSearchValue] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [subDistricts, setSubDistricts] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const [tableData, setTableData] = useState<any[]>([]);

  const [subDistrictsFiltered, setSubDistrictsFiltered] =
    useState<SearchDropDownOption<string>[]>();

  const clearFilters = () => {
    setSubDistrictsFiltered([]);
  };

  const filteredSubDistricts = useMemo(
    () => subDistrictsFiltered?.map((item) => item?.id),
    [subDistrictsFiltered]
  );

  const subDistrictsFilteredArray = useMemo(
    () =>
      data?.allPortalClinics?.filter((el) => {
        return filteredSubDistricts?.some((f) => {
          return f === el?.subDistrict?.id;
        });
      }),
    [data?.allPortalClinics, filteredSubDistricts]
  );

  useEffect(() => {
    if (data && data.allPortalClinics) {
      const copyItems = data.allPortalClinics
        .filter((v) => v?.isActive === true)
        .map((item: ClinicDto) => ({
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
    if (subDistrictsData?.subDistrictsAndStats?.length > 0) {
      setSubDistricts(
        subDistrictsData?.subDistrictsAndStats?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
            id: item?.id,
          };
        })
      );
    }
  }, [subDistrictsData?.subDistrictsAndStats]);

  useEffect(() => {
    if (subDistrictsFiltered?.length > 0) {
      const clinicsFilteredAndSorted = subDistrictsFilteredArray
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );
      setTableData(clinicsFilteredAndSorted);
    } else {
      const clinicsFilteredAndSorted = data?.allPortalClinics
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );
      setTableData(clinicsFilteredAndSorted);
    }
  }, [data, subDistrictsFiltered, subDistrictsFilteredArray]);

  const panel = usePanel();
  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Add a clinic',
      render: (onSubmit: any) => (
        <CreateClinicPanel
          key={`clinicPanelCreate`}
          closeDialog={(clinicCreated: boolean) => {
            onSubmit();

            if (clinicCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const filterByValue = useCallback((array, value) => {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }, []);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const handleViewClinic = useCallback(
    (clinic) => {
      history.push({
        pathname: '/clinics/view-clinics',
        state: {
          component: 'clinic',
          clinic: clinic,
        },
      });
    },
    [history]
  );

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
                    className="focus:outline-none sm:text-md block w-full rounded-md bg-white py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="         Search by unique ID or clinic name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="mt-4 flex flex-row items-center justify-between sm:mt-6">
                    <div className=" w-6/12">
                      <SearchDropDown<string>
                        displayMenuOverlay={true}
                        className={'mr-1'}
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
              {hasPermission(PermissionEnum.create_user) &&
                (isAdministrator || isSuperAdmin) && (
                  <button
                    onClick={displayPanel}
                    type="button"
                    className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                  >
                    + Add a Clinic
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
                    { field: 'name', use: 'Name' },
                    { field: 'teamLeads', use: 'teamLead(s)' },
                    { field: 'subDistrict', use: 'Sub-district' },
                    { field: 'insertedDate', use: 'Date added' },
                  ]}
                  rows={
                    searchValue !== 'Search by title or content...'
                      ? filterByValue(tableData, searchValue)
                      : tableData
                  }
                  viewRow={
                    hasPermission(PermissionEnum.update_user) &&
                    handleViewClinic
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
