import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { DeleteRole, RoleList } from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../components/content-loader/content-loader';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import UiTable from '../../components/ui-table';
import { useUser } from '../../hooks/useUser';
import RolePanel from './components/role-panel/role-panel';

export default function Roles() {
  const { hasPermission } = useUser();
  const { data, refetch } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const [deleteRole] = useMutation(DeleteRole);
  const [tableData, setTableData] = useState<any[]>([]);
  const panel = usePanel();

  useEffect(() => {
    if (data && data.roles) {
      const copyItems = data.roles.map((item) => ({
        ...item,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const displayRolePanel = () => {
    panel({
      noPadding: true,
      title: 'Create Role',
      render: (onSubmit: any) => (
        <RolePanel
          closeDialog={(roleCreated: boolean) => {
            onSubmit();

            if (roleCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const displayEditUserPanel = (role: any) => {
    panel({
      noPadding: true,
      title: 'Edit Role',
      render: (onSubmit: any) => (
        <RolePanel
          role={role}
          closeDialog={(roleUpdated: boolean) => {
            onSubmit();

            if (roleUpdated) {
              refetch();
            }
          }}
        />
      ),
    });
  };
  const deleteRoleAndRefresh = async (role: any) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Delete Role"
          message={`You are about to delete a Role, this can implicate data issues. Would you like to go ahead`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();

            deleteRole({
              variables: {
                id: role.id,
              },
            })
              .then((response: any) => {
                console.log(response);
                if (response) {
                  refetch();

                  setNotification({
                    title: 'Successfully Deleted Role!',
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

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="flex text-lg leading-6 font-medium text-gray-900 items-center justify-center"></span>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_system) && (
                <button
                  onClick={displayRolePanel}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                >
                  Create Role
                </button>
              )}
            </div>
          </div>

          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <UiTable
                  columns={[{ field: 'name', use: 'name' }]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_system) &&
                    displayEditUserPanel
                  }
                  deleteRow={
                    hasPermission(PermissionEnum.delete_system) &&
                    deleteRoleAndRefresh
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
