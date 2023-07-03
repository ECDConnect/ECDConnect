import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  useDialog,
  useNotifications,
  UserDto,
} from '@ecdlink/core';
import { GetUserById, SendInviteToApplication, UserList } from '@ecdlink/graphql';
import { Dropdown } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { SearchIcon, ChevronDownIcon } from '@heroicons/react/solid';
import debounce from 'lodash.debounce';

export default function ApplicationUsers() {
  const dialog = useDialog();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sendInviteToApplication, { loading: invitationLoading }] = useMutation(SendInviteToApplication);
  const { setNotification } = useNotifications();



  const resendInvitation = async (userId: string) => {
    await sendInviteToApplication({
      variables: {
        userId: userId,
      },
    });
    setNotification({
      title: 'Successfully Sent User an Invite!',
      variant: NOTIFICATION.SUCCESS,
    });
  }

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const [getAllUsers, { data, refetch }] = useLazyQuery(UserList, {
    variables: {
      pageNumber: 1,
      pageSize: 10,
      search: "",
      filterBy: [],
      sortBy: [{ fieldName: "FullName", descending: true }],
      pagingInput: {}
    },
    fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    getAllUsers({
      variables: {
        pageNumber: 1,
        pageSize: 10,
        search: searchValue,
        filterBy: [],
        sortBy: [{ fieldName: "FullName", descending: true }],
        pagingInput: {}
      }
    });

  }, [searchValue])


  const [tableData, setTableData] = useState<any[]>([]);

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();

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
      console.log('>>', finalTableData);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.users) return;

    let allUsers: UserDto[] = [...data.users];
    console.log(selectedRoleFilter);

    if (selectedRoleFilter) {
      allUsers = allUsers.filter((user) =>
        user.roles.some((role) => role.name === selectedRoleFilter)
      );
    }

    setTableData(
      allUsers.filter((v) => v.isActive === true).map(mapUserTableItem)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleFilter]);

  const mapUserTableItem = (user: UserDto) => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.surname}`,
      _view: undefined,
      _edit: undefined,
      _url: undefined,
    };
  };

  const getDefaultStartDate = () => {
    const currentDate = new Date();
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    return previousMonth.toISOString().split('T')[0];
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
                    placeholder="      Search by email, id number or name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="mt-4 flex items-center sm:mt-6 ">
                    <div>
                      <button
                        id="dropdownDividerButton"
                        className="bg-secondary focus:border-secondary focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
                        type="button"
                        onClick={toggleDropdown}
                      >
                        Date Invited
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="Filter by status"
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

                    <div className="flex-start flex flex-col justify-around ">
                      {isDropdownVisible && (
                        <div
                          id="dropdownDivider"
                          className=" flex w-96 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
                        >
                          <div className="w-1/2 p-4">
                            <label htmlFor="">Start Date</label>

                            <input
                              defaultValue={startDate}
                              type="date"
                              className="bg-uiBg focus:outline-none sm:text-md border-secondary block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                              onChange={handleStartDateChange}
                              placeholder="Start Date"
                            />
                          </div>
                          <div className="w-1/2 p-4">
                            <label htmlFor="">End Date</label>

                            <input
                              defaultValue={endDate}
                              type="date"
                              className="bg-uiBg focus:outline-none sm:text-md border-secondary block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                              onChange={handleEndDateChange}
                              placeholder="End Date"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mx-4 w-3/12">
                <span className="w-full text-lg font-medium leading-6 text-gray-900">
                  <button onClick={() => setShowFilter(!showFilter)} id="dropdownHoverButton"
                    className="text-white bg-secondary hover:bg-gray-300 focus:border-secondary focus:ring-2 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary"
                    type="button">Filter
                    <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
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
                    { field: 'idNumber', use: 'ID/Passport' },
                    { field: 'email', use: 'Email' },
                    { field: 'fullName', use: 'Name' },
                    {
                      field: 'roles',
                      use: 'Role',
                      type: 'array',
                      displayProperty: 'name',
                    },
                    { field: 'StartDate', use: 'Date Invited' },
                    { field: 'isActive', use: 'Status' },
                  ]}
                  rows={tableData}
                  searchInput={searchValue}
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
function saveRoles(userId: any) {
  throw new Error('Function not implemented.');
}

