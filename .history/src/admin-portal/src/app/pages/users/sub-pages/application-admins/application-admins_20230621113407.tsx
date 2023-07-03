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
import { DialogPosition, Dropdown, DropDownOption } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import UserPanelCreate from '../../components/user-panel-create/user-panel-create';
import UserPanelEdit from '../../components/user-panel-edit/user-panel-edit';
import { ChevronDownIcon, PlusIcon, SearchIcon } from '@heroicons/react/solid';

export default function ApplicationAdmins() {
  const { data, refetch, loading } = useQuery(UserList, {
    variables: {
      pagingInput: {
        pageNumber: 1,
        pageSize: 20,
        filterBy: [
          { fieldName: "ADMINISTRATOR", filterType: "EQUALS", value: "true" }
        ],
        sortBy: [{ fieldName: "FullName", descending: true }]
      }
    }
  });

  const { setNotification } = useNotifications();
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
      const modifiedData = copyItems.map((obj: { [x: string]: any; __typename: any; roles: any; }) => {
        const { "__typename": _, roles, ...rest } = obj;
        const modifiedRoles = roles.map((role: { [x: string]: any; __typename: any; }) => {
          const { "__typename": __, ...roleRest } = role;
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
    let userStatus = statusFilter === 'active' ? true : false

    let allUsers: UserDto[] = [...data.users];
    setTableData(
      allUsers.filter((v) => v.isActive === (statusFilter === '' ? true : userStatus)).map(mapUserTableItem)
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
                  <div className="flex items-center mt-4 sm:mt-6 flex-row justify-between">
                    {/* <div>
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="Filter roles"
                        labelColor="white"
                        selectedValue={selectedRoleFilter}
                        list={getRoleOptions(data?.users) || []}
                        onChange={(item) => {
                          setSelectedRoleFilter(item);
                        }}
                      />
                    </div> */}

                    <div>

                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            onClick={() => setShowDropDownFilter(!showDropDownFilter)}
                            className={`inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-normal border-2 border-secondary ${!showDropDownFilter ? 'text-white bg-secondary' : 'text-secondary bg-white border-2 border-secondary'
                              } hover:bg-white hover:text-secondary `}
                            id="menu-button"
                            aria-expanded={showDropDownFilter}
                            aria-haspopup={showDropDownFilter}
                          >
                            {statusFilter === '' ? "Filter by status" : statusFilter}
                            <svg
                              className={`-mr-1 h-5 w-5 hover:text-white ${!showDropDownFilter ? 'text-white hover:text-secondary' : 'text-secondary hover:text-white'
                                }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        {/*  */}
                        {showDropDownFilter && <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="horizontal" aria-labelledby="menu-button" >
                          <div className="py-1" role="none">
                            {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                            <a onClick={() => { setStatusFilter('active'); setShowDropDownFilter(!showDropDownFilter); }} className=" cursor-auto text-gray-700 block px-4 py-2 text-sm focus:bg-secondary focus:text-white" role="menuitem" id="menu-item-0">Active</a>
                            <a onClick={() => { setStatusFilter('inactive'); setShowDropDownFilter(!showDropDownFilter) }} className="cursor-auto text-gray-700 block px-4 py-2 text-sm focus:bg-secondary focus:text-white" role="menuitem" id="menu-item-1">Inactive</a>

                          </div>
                        </div>}
                      </div>

                    </div>

                    <div className='justify-self col-end-3 '>
                      <button
                        onClick={() => setStatusFilter('')}
                        type="button"
                        className="text-secondary hover:bg-secondary hover:text-white outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm "
                      >
                        Clear All
                      </button>
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

            <div className="mt-3 justify-end sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
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
                    { field: 'email', use: 'Email' },
                    { field: 'fullName', use: 'name' },
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
