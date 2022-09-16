import { useMutation, useQuery } from '@apollo/client';
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

export default function ApplicationUsers() {
  const dialog = useDialog();
  const { data, refetch } = useQuery(UserList, {
    fetchPolicy: 'cache-and-network',
  });
  const { setNotification } = useNotifications();
  const { hasPermission } = useUser();

  const [tableData, setTableData] = useState<any[]>([]);

  const [deleteUser] = useMutation(DeleteUser);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>();
  const panel = usePanel();

  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users.map(mapUserTableItem);
      setTableData(copyItems);
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

  const displayUserPanel = () => {
    panel({
      noPadding: true,
      title: 'Create User',
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
      title: 'Edit User',
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
          title="Deactivate User"
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

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg leading-6 font-medium text-gray-900 flex flex-row">
              <Dropdown
                className="mr-2"
                fillType="clear"
                placeholder="Filter roles"
                selectedValue={selectedRoleFilter}
                list={getRoleOptions(data?.users) || []}
                onChange={(item) => {
                  setSelectedRoleFilter(item);
                }}
              />
            </span>

            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayUserPanel}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Create User
                </button>
              )}
            </div>
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
