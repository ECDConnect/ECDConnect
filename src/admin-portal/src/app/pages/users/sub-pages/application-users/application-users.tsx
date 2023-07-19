import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  useDialog,
  useNotifications,
  UserDto,
} from '@ecdlink/core';
import {
  getUserCount,
  sentInviteToMultipleUsers,
  UserList,
  SortEnumType,
  ApplicationUserSortInput,
} from '@ecdlink/graphql';
import { DropDownOption, Dropdown } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { SearchIcon, ChevronDownIcon } from '@heroicons/react/solid';
import debounce from 'lodash.debounce';
import CustomDateRangePicker from '../../../../components/date-picker';

export default function ApplicationUsers() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(null);

  // type SortInput = { [Key in keyof ApplicationUserSortInput]?: ApplicationUserSortInput[Key] };
  // const getSortInput = (sorts: SortInput[]) => {
  //   return sorts.map(sort => sort);
  // };

  // const sortinput = getSortInput([
  //   { insertedDate : sortDescending ? SortEnumType.Desc : SortEnumType.Asc },
  //   { fullName: sortDescending ? SortEnumType.Desc : SortEnumType.Asc }
  // ]);

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

  const { data: userCountData } = useQuery(getUserCount, {
    fetchPolicy: 'cache-and-network',
    variables: {
      search: '',
    },
  });

  const [getAllUsers, { data, refetch }] = useLazyQuery(UserList, {
    variables: getVariables(searchValue, sortDescending, selectedPage, 100),
    fetchPolicy: 'network-only',
  });

  const getRoleOptions = (users: UserDto[]) => {
    if (!users) return [];

    return users.reduce(
      (acc, curr) => {
        const items = curr.roles.map((x) => ({ label: x.name, value: x.name }));

        const distinctItems = items.filter(
          (item) => !acc.some((ac) => ac.value === item.value)
        );

        if (distinctItems) {
          return [...acc, ...distinctItems];
        }

        return acc;
      },
      [
        {
          label: 'All',
          value: undefined,
        },
      ] as DropDownOption<string>[]
    );
  };

  useEffect(() => {
    getAllUsers({
      variables: getVariables(
        searchValue,
        sortDescending,
        selectedPage,
        selectedPageSize ?? userCountData?.countUsers ?? 100
      ),
    });
  }, [searchValue, nameFilter, userCountData, sortDescending, selectedPage]);

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users;
      const modifiedData = copyItems.map((obj) => {
        const { __typename: _, roles, ...rest } = obj;
        const modifiedRoles = roles.map((role) => {
          const { __typename: __, ...roleRest } = role;
          return roleRest;
        });
        return { ...rest, roles: modifiedRoles };
      });
      const finalTableData = modifiedData.map(({ roles, ...rest }) => rest);
      setTableData(finalTableData);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.users) return;

    let allUsers: UserDto[] = [...data.users];
    let userStatus = statusFilter === 'active' ? true : false;

    if (selectedRoleFilter) {
      allUsers = allUsers.filter((user) =>
        user.roles.some((role) => role.name === selectedRoleFilter)
      );
    }

    if (userStatus) {
      setTableData(
        allUsers
          .filter((user) => user.isActive === userStatus)
          .map(mapUserTableItem)
      );
    }

    if (selectedRoleFilter) {
      allUsers = allUsers.filter((user) =>
        user.roles.some((role) => role.name === selectedRoleFilter)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleFilter, statusFilter]);

  const mapUserTableItem = (user: UserDto) => {
    return {
      ...user,
      fullName: `${user?.firstName} ${user?.surname}`,
      email: user?.userName ?? user?.idNumber ?? user?.email ?? '',
    };
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const clearFilters = () => {
    setStatusFilter('');
    setNameFilter(false);
    setSelectedRoleFilter('');
  };

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
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by email, id number or name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="mb-4 flex w-full flex-row items-center ">
                    <span className="flex w-4/12 flex-row text-lg font-medium leading-6 text-gray-900">
                      <Dropdown
                        className="mr-2 w-full"
                        fillType="filled"
                        fillColor="secondary"
                        placeholder="Filter roles"
                        labelColor="white"
                        selectedValue={selectedRoleFilter}
                        list={getRoleOptions(data?.users) || []}
                        onChange={(item) => {
                          setSelectedRoleFilter(item);
                        }}
                      />
                    </span>

                    <div className=" w-4/12">
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

                    <div className=" w-4/12">
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
                    {/* <CustomDateRangePicker handleDateChange={handleDateChange} selectedRange={selectedRange} /> */}
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
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'email', use: 'ID/Passport/Email' },
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
                  rows={tableData}
                  urlRow={'/view-user/'}
                  component={'administrators'}
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
