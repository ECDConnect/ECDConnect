import { useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import {
  PermissionEnum,
  RoleSystemNameEnum,
  usePanel,
  UserDto,
} from '@ecdlink/core';
import { UserList } from '@ecdlink/graphql';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import { useUser } from '../../../../hooks/useUser';
import UserPanelCreate from '../../components/user-panel-create/user-panel-create';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import {
  Dropdown,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { AdminTypes, Status } from './applications-admins.types';
import UiTable from './components/ui-table';
import { filterByValue } from '../../../../utils/string-utils/string-utils';

export const sortByClientStatusOptions: SearchDropDownOption<string>[] = [
  Status?.ACTIVE,
  Status?.INACTIVE,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function ApplicationAdmins() {
  const history = useHistory();
  const location = useLocation();

  const { hasPermission, user } = useUser();
  const isSuperAdmin = user?.roles?.some(
    (role: any) => role.systemName === AdminTypes.SuperAdmin
  );

  const [searchValue, setSearchValue] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);

  const panel = usePanel();
  const [statusFilter, setStatusFilter] = useState<
    SearchDropDownOption<string>[]
  >([sortByClientStatusOptions[0]]);
  const [showFilter, setShowFilter] = useState(false);

  // TODO: add pagination
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(null);
  const [types, setTypes] = useState<SearchDropDownOption<string>[]>([]);

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const clearFilters = () => {
    setTypes([]);
    setEndDate(null);
    setStartDate(null);
    setStatusFilter([]);
  };

  const queryVariables = useMemo(
    () => ({
      search: '',
      order: [{ insertedDate: 'DESC' }, { fullName: 'DESC' }],
      pagingInput: {
        pageNumber: selectedPage,
        pageSize: selectedPageSize,
        filterBy: [
          {
            fieldName: 'ADMINISTRATOR',
            filterType: 'EQUALS',
            value: 'true',
          },
        ],
      },
    }),
    [selectedPage, selectedPageSize]
  );

  const { data, refetch, loading } = useQuery(UserList, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    history.replace({
      pathname: location.pathname,
      state: { queryVariables },
    });
  }, [history, location.pathname, queryVariables]);

  useEffect(() => {
    if (data?.users) {
      const copyItems = data?.users;
      const modifiedData = copyItems
        .map((obj: { [x: string]: any; __typename: any; roles: any }) => {
          const newUserData = {
            ...obj,
            displayColumnIdPassportEmail:
              obj?.email || obj?.userName || obj?.idNumber || '',
          };

          const { __typename: _, roles, ...rest } = newUserData;
          const modifiedRoles = roles.map(
            (role: { [x: string]: any; __typename: any }) => {
              const { __typename: __, ...roleRest } = role;
              return roleRest;
            }
          );
          return { ...rest, roles: modifiedRoles };
        })
        ?.slice()
        ?.sort((a, b) =>
          a.insertedDate > b.insertedDate
            ? -1
            : a.insertedDate < b.insertedDate
            ? 1
            : 0
        );

      const filteredByDateData = modifiedData
        ?.filter((d) => {
          return (
            new Date(d?.insertedDate).getTime() >=
              new Date(startDate)?.getTime() &&
            new Date(d?.insertedDate).getTime() <= new Date(endDate)?.getTime()
          );
        })
        .map(mapUserTableItem);

      if (startDate && endDate) {
        if (statusFilter?.length === 1) {
          if (statusFilter.some((e) => e.value === Status?.ACTIVE)) {
            const filterByStatusActive = filteredByDateData
              ?.filter((item) => item?.isActive)
              .map(mapUserTableItem);
            setTableData(filterByStatusActive);
            return;
          } else {
            const filterByStatusInactive = filteredByDateData
              ?.filter((item) => !item?.isActive)
              .map(mapUserTableItem);
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
            const filterByStatusActive = modifiedData?.filter(
              (item) => item?.isActive
            );
            setTableData(filterByStatusActive);
            return;
          } else {
            const filterByStatusInactive = modifiedData?.filter(
              (item) => !item?.isActive
            );
            setTableData(filterByStatusInactive);
            return;
          }
        }
      }
      setTableData(modifiedData);
    }
  }, [data?.users, endDate, startDate, statusFilter]);

  const displayUserPanel = () => {
    panel({
      noPadding: true,
      title: '',
      render: (onSubmit: any) => (
        <UserPanelCreate
          key={`inviteAdminUser`}
          closeDialog={(userCreated: boolean) => {
            onSubmit();
            if (userCreated) {
              refetch();
              // TODO: Use actual pagination when table component supports it.
              // refetchCount();
            }
          }}
        />
      ),
    });
  };

  const viewSelectedRow = (selectedRow: any) => {
    const role = selectedRow?.roles;

    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    history.push({
      pathname: '/users/view-user',
      state: {
        component: role?.[0]?.name,
        userId: selectedRow?.id,
      },
    });
  };

  const mapUserTableItem = (user: UserDto) => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.surname}`,
    };
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const hasDateFilter = useMemo(() => (!startDate ? 0 : 1), [startDate]);
  const numberOfFilters = useMemo(
    () => statusFilter?.length + types?.length + hasDateFilter,
    [statusFilter?.length, types?.length, hasDateFilter]
  );

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
            <div className="text-body w-11/12 sm:flex  sm:justify-around">
              <div className="text-body w-11/12 flex-col sm:flex sm:justify-around">
                <div className="relative w-full">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="focus:outline-none sm:text-md block w-full rounded-md bg-white py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by email or name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="items-left mt-4 flex flex-row sm:mt-6">
                    {!filterDateAdded && (
                      <div
                        className="min-w mr-2 flex items-center gap-2"
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

                    <div className="items-left mr-2 flex gap-2">
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

                    <div className="justify-self z-20 col-end-3 ml-2">
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
            </div>

            <div className="mt-3 justify-end sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && isSuperAdmin && (
                <button
                  onClick={displayUserPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                  Create Administrator
                </button>
              )}
            </div>
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    {
                      field: 'displayColumnIdPassportEmail',
                      use: 'Email/Username/Id',
                    },
                    { field: 'fullName', use: 'name' },
                    { field: 'insertedDate', use: 'Date Invited' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  viewRow={viewSelectedRow}
                  rows={
                    searchValue !== 'Search by title or content...'
                      ? filterByValue(tableData, searchValue)
                      : tableData
                  }
                  sendRow={true}
                  options={{
                    per_page: selectedPageSize,
                    rows: tableData?.length,
                  }}
                  component={'administrators'}
                  isLoading={loading}
                  refetchData={refetch}
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
