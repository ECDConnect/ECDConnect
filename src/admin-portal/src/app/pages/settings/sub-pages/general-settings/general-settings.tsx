import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  SettingsDto,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { DeleteSystemSetting, GetAllSystemSetting } from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/old-ui-table';
import { useUser } from '../../../../hooks/useUser';
import GeneralSettingsPanel from './components/general-settings-panel/general-settings-panel';

export default function GeneralSettingsView() {
  const { hasPermission } = useUser();
  const type = 'General Settings';
  const { data, refetch } = useQuery(GetAllSystemSetting, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const [deleteMutation] = useMutation(DeleteSystemSetting);
  const panel = usePanel();

  useEffect(() => {
    if (data && data.GetAllSystemSetting) {
      const copyItems = data.GetAllSystemSetting.map((item) => ({
        ...item,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const displayPanel = (item?: SettingsDto) => {
    panel({
      noPadding: true,
      title: item ? `Edit ${type}` : `Create ${type}`,
      render: (onSubmit: any) => (
        <GeneralSettingsPanel
          item={item}
          closeDialog={(result: boolean) => {
            if (result) {
              refetch();
            }

            onSubmit();
          }}
        />
      ),
    });
  };

  const deleteAndRefresh = async (item: SettingsDto) => {
    if (!item.isSystemValue) {
      dialog({
        position: DialogPosition.Middle,
        render: (onSubmit: any, onCancel: any) => (
          <AlertModal
            title={`Delete ${type}`}
            message={`You are about to delete a ${type}, this can implicate data issues. Would you like to go ahead`}
            onCancel={onCancel}
            onSubmit={() => {
              onSubmit();

              deleteMutation({
                variables: {
                  id: item.id,
                },
              })
                .then((response: any) => {
                  if (response) {
                    refetch();

                    setNotification({
                      title: `Successfully Deleted ${type}`,
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
    } else {
      dialog({
        position: DialogPosition.Middle,
        render: (onSubmit: any, onCancel: any) => (
          <AlertModal
            title={`Error!`}
            message={`You are trying to delete a System Setting, this is not allowed, please contact support if you have any enquiries`}
            onCancel={onCancel}
            onSubmit={() => {
              onSubmit();
            }}
          />
        ),
      });
    }
  };

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg font-medium leading-6 text-gray-900"></span>
            <div className="mt-3 sm:mt-0 sm:ml-4"></div>
          </div>

          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'grouping', use: 'grouping' },
                    { field: 'name', use: 'name' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_system) && displayPanel
                  }
                  deleteRow={
                    hasPermission(PermissionEnum.delete_system) &&
                    deleteAndRefresh
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
