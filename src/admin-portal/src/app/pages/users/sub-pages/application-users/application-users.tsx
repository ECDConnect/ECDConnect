import { useMutation, useQuery } from '@apollo/client';
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
import { PlusIcon } from '@heroicons/react/solid';

export default function ApplicationUsers() {
  const dialog = useDialog();
  const { data, refetch } = useQuery(UserList, {
    fetchPolicy: 'cache-and-network',
  });
  const { setNotification } = useNotifications();
  const { hasPermission } = useUser();

  const [searchValue, setSearchValue] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);

  const [deleteUser] = useMutation(DeleteUser);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();
  const panel = usePanel();

  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users.map(mapUserTableItem);
      setTableData(copyItems);
      console.log('>>', data);
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
  }, [selectedRoleFilter]);

  const displayUserPanel = () => {
    console.log('test');
    panel({
      noPadding: true,
      title: 'Create Administrator',
      render: (onSubmit: any) => (
        <UserPanelCreate
          key={`userPanelCreate`}
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

  const displayEditUserPanel = (user: any) => {
    panel({
      noPadding: true,
      title: 'Edit Administrator',
      render: (onSubmit) => (
        <UserPanelEdit
          key={`userPanelEdit`}
          user={user}
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

  const deleteUserAndRefresh = async (user: any) => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Deactivate Administrator"
          message={`You are about to deactive a user. Would you like to go ahead`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();

            deleteUser({
              variables: {
                id: user.id,
              },
            })
              .then((response: any) => {
                if (response.data.deleteUser) {
                  refetch();

                  setNotification({
                    title: 'Successfully Deactivated User!',
                    variant: NOTIFICATION.SUCCESS,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      ),
    });
  };

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

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body sm:flex sm:justify-around  w-6/12">
              <div className="w-full ">
                <input
                  className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-8 pr-3  leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                  placeholder="Search by email or name..."
                  onChange={search}
                />
                <span className="left- input-group-text absolute inset-y-1/2 flex items-center whitespace-nowrap rounded text-center text-base font-normal text-gray-600">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="search"
                    className="w-"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                    ></path>
                  </svg>
                </span>
              </div>
              <div className='mx-4 w-3/12'>
                <span className="text-lg font-medium leading-6 text-gray-900 w-full">
                  <Dropdown
                    fillType="filled"
                    textColor='white'
                    fillColor='secondary'
                    placeholder="Filter roles"
                    labelColor='white'
                    selectedValue={selectedRoleFilter}
                    list={getRoleOptions(data?.users) || []}
                    onChange={(item) => {
                      setSelectedRoleFilter(item);
                    }}
                    
                  />
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
                    { field: 'idNumber', use: 'id / Passport' },
                    { field: 'fullName', use: 'name' },
                    { field: 'isActive', use: 'Active' },
                    {
                      field: 'roles',
                      use: 'roles',
                      type: 'array',
                      displayProperty: 'name',
                    },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditUserPanel
                  }
                  deleteRow={
                    hasPermission(PermissionEnum.delete_user) &&
                    deleteUserAndRefresh
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
