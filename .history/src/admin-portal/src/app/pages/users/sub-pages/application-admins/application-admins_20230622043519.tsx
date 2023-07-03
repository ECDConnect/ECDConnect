import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
  UserDto,
} from '@ecdlink/core';
import { DeleteUser, UserList } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import UserPanelCreate from '../../components/user-panel-create/user-panel-create';
import { ChevronDownIcon, PlusIcon, SearchIcon } from '@heroicons/react/solid';
import { Dropdown } from '@ecdlink/ui';
import Datepicker from "react-tailwindcss-datepicker";


export default function ApplicationAdmins() {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });
  const { data, refetch, loading } = useQuery(UserList, {
    variables: {
      pagingInput: {
        pageNumber: 1,
        pageSize: 20,
        filterBy: [
          { fieldName: 'ADMINISTRATOR', filterType: 'EQUALS', value: 'true' },
        ],
        sortBy: [{ fieldName: 'FullName', descending: true }],
      },
    },
  });
  const { hasPermission } = useUser();

  const [searchValue, setSearchValue] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);

  const [deleteUser] = useMutation(DeleteUser);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();
  const panel = usePanel();
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDropDownFilter, setShowDropDownFilter] = useState(false);

  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users;
      const modifiedData = copyItems.map(
        (obj: { [x: string]: any; __typename: any; roles: any }) => {
          const { __typename: _, roles, ...rest } = obj;
          const modifiedRoles = roles.map(
            (role: { [x: string]: any; __typename: any }) => {
              const { __typename: __, ...roleRest } = role;
              return roleRest;
            }
          );
          return { ...rest, roles: modifiedRoles };
        }
      );
      const finalTableData = modifiedData.map(({ roles, ...rest }) => rest);
      setTableData(finalTableData);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.users) return;
    let userStatus = statusFilter === 'active' ? true : false;

    let allUsers: UserDto[] = [...data.users];
    setTableData(
      allUsers
        .filter((v) => v.isActive === (statusFilter === '' ? true : userStatus))
        .map(mapUserTableItem)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

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
            }
          }}
        />
      ),
    });
  };

  const mapUserTableItem = (user: UserDto) => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.surname}`,
      _view: undefined,
      _edit: undefined,
      _url: undefined,
    };
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || ' ');
  }, 150);


  const clearFilters = () => {
    setStatusFilter('');
  }
  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  }

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-full sm:flex  ">
              <div className="text-body w-8/12 flex-col sm:flex sm:justify-around">
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

            <div className="mt-0  flex flex-row sm:mt-0 sm:ml-4 ">
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
            <div className="ml-4 w-3/12">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayUserPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white  focus:ring-2 focus:ring-offset-2"
                >
                  <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                  Add Administrator
                </button>
              )}
            </div>
          </div>
          {showFilter && (
            <div className="mb-4 flex w-full flex-row items-center">
              <div className="g">
                <Datepicker
                  value={value}
                  onChange={handleValueChange}
                />
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
                  className='p-2'
                />
              </div>

              <div className="justify-end w-full flex">
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

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'email', use: 'Email' },
                    { field: 'fullName', use: 'name' },

                    { field: 'InsertedDate', use: 'Date Invited' },

                    { field: 'isActive', use: 'Active' },
                  ]}
                  urlRow={'/view-user/'}
                  rows={tableData}
                  sendRow={true}
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
