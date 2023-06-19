import {  useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import {
  useDialog,
  UserDto,
} from '@ecdlink/core';
import { UserList } from '@ecdlink/graphql';
import { Dropdown } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { SearchIcon, ChevronDownIcon } from '@heroicons/react/solid';

export default function ApplicationUsers() {
  const dialog = useDialog();
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const { data, refetch } = useQuery(UserList, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();


  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users;
      setTableData(copyItems);
      console.log('>>', data);
    }
  }, [data]);
  useEffect(() => {
    if (!data?.users) return;

    let allUsers: UserDto[] = [...data.users];

    if (selectedRoleFilter) {
      allUsers = allUsers.filter((user) =>
        user.roles.some((role) => role.name === selectedRoleFilter)
      );
    }

    setTableData(
      allUsers.filter((v) => v.isActive === true).map(mapUserTableItem)
    );
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
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
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
              <div className="text-body w-8/12 sm:flex flex-col sm:justify-around">
                <div className="relative w-full">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by email or name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="flex items-center mt-4 sm:mt-6 ">
                    <div>
                      <button
                        id="dropdownDividerButton"
                        className="text-white bg-secondary hover:bg-gray-300 focus:border-secondary focus:ring-2 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary"
                        type="button"
                        onClick={toggleDropdown}
                      >
                        Date Invited
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
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
                          { label: 'All', value: '' },
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                        onChange={(item) => {
                          setStatusFilter(item);
                        }}
                        className='p-2'
                      />
                    </div>

                    <div className="flex flex-col flex-start justify-around ">
                      {isDropdownVisible && (
                        <div
                          id="dropdownDivider"
                          className=" bg-white divide-y divide-gray-100 rounded-lg shadow w-96 dark:bg-gray-700 dark:divide-gray-600 flex"
                        >
                          <div className="p-4 w-1/2">
                            <label htmlFor="">Start Date</label>

                            <input
                              defaultValue={startDate}
                              type="date"
                              className="bg-uiBg focus:outline-none sm:text-md block w-full border-secondary rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                              onChange={handleStartDateChange}
                              placeholder="Start Date"
                            />
                          </div>
                          <div className="p-4 w-1/2">
                            <label htmlFor="">End Date</label>

                            <input
                              defaultValue={endDate}
                              type="date"
                              className="bg-uiBg focus:outline-none sm:text-md block w-full border-secondary rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
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
                    { field: 'email', use: 'Email' },
                    { field: 'fullName', use: 'Name' },
                    { field: 'roles', use: 'Role' },
                    { field: 'startDate', use: 'Date Invited' },
                    { field: 'isActive', use: 'Status' },
                  ]}
                  rows={tableData}
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
