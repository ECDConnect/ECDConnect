import { useLazyQuery } from '@apollo/client';
import { UserDto } from '@ecdlink/core';
import { UserList, SortEnumType } from '@ecdlink/graphql';
import {
  DropDownOption,
  Dropdown,
  SearchDropDown,
  SearchDropDownOption,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import debounce from 'lodash.debounce';
import { useHistory } from 'react-router';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Status } from '../application-admins/applications-admins.types';

export const sortByClientStatusOptions: SearchDropDownOption<string>[] = [
  Status?.ACTIVE,
  Status?.INACTIVE,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function ApplicationUsers() {
  const [searchValue, setSearchValue] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const dateDropdownValue = useMemo(
    () =>
      startDate && endDate
        ? `${format(startDate, 'd MMM yy')} - ${format(endDate, 'd MMM yy')}`
        : '',
    [endDate, startDate]
  );

  // TODO: When sort by gets implemented, this could be useful, else remove.
  // type SortInput = { [Key in keyof ApplicationUserSortInput]?: ApplicationUserSortInput[Key] };
  // const getSortInput = (sorts: SortInput[]) => {
  //   return sorts.map(sort => sort);
  // };
  //
  // const sortinput = getSortInput([
  //   { insertedDate : sortDescending ? SortEnumType.Desc : SortEnumType.Asc },
  //   { fullName: sortDescending ? SortEnumType.Desc : SortEnumType.Asc }
  // ]);
  const history = useHistory();

  const viewSelectedRow = (selectedRow: any) => {
    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    history.push({
      pathname: '/users/view-user',
      state: {
        component: 'administrators',
        userId: selectedRow?.userId,
      },
    });
  };

  const getVariables = (
    search: string,
    sortDescending: boolean,
    currentPage: number,
    pageSize: number
  ) => {
    return {
      search: search,
      order: [
        { insertedDate: sortDescending ? SortEnumType.Desc : SortEnumType.Asc },
        { fullName: sortDescending ? SortEnumType.Desc : SortEnumType.Asc },
      ],
      pagingInput: {
        pageNumber: currentPage,
        pageSize: pageSize,
      },
    };
  };

  const [getAllUsers, { data }] = useLazyQuery(UserList, {
    variables: getVariables(searchValue, sortDescending, selectedPage, 100),
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getAllUsers({
      variables: getVariables(
        '',
        sortDescending,
        selectedPage,
        selectedPageSize
      ),
    });
  }, [getAllUsers, selectedPage, selectedPageSize, sortDescending]);

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users;
      const modifiedData = copyItems.map((obj) => {
        const newUserData = {
          ...obj,
          displayColumnIdPassportEmail:
            obj?.userName || obj?.idNumber || obj?.email || '',
        };
        const { __typename: _, roles, ...rest } = newUserData;
        const modifiedRoles = roles.map((role) => {
          const { __typename: __, ...roleRest } = role;
          return roleRest;
        });
        return { ...rest, roles: modifiedRoles };
      });

      // const finalTableData = modifiedData.map(({ roles, ...rest }) => rest);

      const filteredByDateData = modifiedData?.filter((d) => {
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
  }, [data, endDate, startDate, statusFilter]);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const clearFilters = () => {
    setNameFilter(false);
    setSelectedRoleFilter('');
    setEndDate(null);
    setStartDate(null);
    setFilterDateAdded(false);
    setStatusFilter([]);
  };

  const handleSetDateFilter = useCallback(() => {
    setFilterDateAdded(!filterDateAdded);
  }, [filterDateAdded]);

  useEffect(() => {
    if (endDate) {
      handleSetDateFilter();
    }
  }, [endDate]);

  const filterByValue = useCallback((array, value) => {
    return array?.filter(
      (data) =>
        JSON?.stringify(data)?.toLowerCase()?.indexOf(value?.toLowerCase()) !==
        -1
    );
  }, []);

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-full sm:flex  sm:justify-around">
              <div className="text-body w-full flex-col sm:flex sm:justify-around">
                <div className="relative w-auto">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="focus:outline-none sm:text-md block w-full rounded-md bg-white py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by name, ID or cellphone..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="my-4 flex w-full flex-row items-center ">
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
                      <DatePicker
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange={true}
                        inline
                        shouldCloseOnSelect={true}
                      />
                    )}
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

                    <div className="flex w-3/12 justify-end">
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
              </div>

              <div className="mx-2 w-3/12">
                <span className="w-full text-lg font-medium leading-6 text-gray-900">
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
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    {
                      field: 'displayColumnIdPassportEmail',
                      use: 'ID/Passport/Email',
                    },
                    { field: 'fullName', use: 'Name' },
                    {
                      field: 'roles',
                      use: 'Role',
                      type: 'array',
                      displayProperty: 'name',
                    },
                    { field: 'insertedDate', use: 'date Invited' },
                    { field: 'isActive', use: 'Status' },
                  ]}
                  rows={
                    searchValue !== 'Search by title or content...'
                      ? filterByValue(tableData, searchValue)
                      : tableData
                  }
                  component={'administrators'}
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
