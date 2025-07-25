import { useMutation, useQuery } from '@apollo/client';
import {
  LanguageDto,
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { DeleteLanguage, GetAllLanguage } from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/old-ui-table';
import { useUser } from '../../../../hooks/useUser';
import LanguagePanel from './components/language-panel/language-panel';

export default function LanguageView() {
  const { hasPermission } = useUser();
  const type = 'Language';
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const { data, refetch } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [deleteMutation] = useMutation(DeleteLanguage);
  const panel = usePanel();

  useEffect(() => {
    if (data && data.GetAllLanguage) {
      const copyItems = data.GetAllLanguage.map((item) => ({
        ...item,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const displayPanel = (item?: LanguageDto) => {
    panel({
      noPadding: true,
      title: item ? `Edit ${type}` : `Create ${type}`,
      render: (onSubmit: any) => (
        <LanguagePanel
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

  const deleteAndRefresh = async (item: LanguageDto) => {
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
                console.log(response);
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
  };

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg font-medium leading-6 text-gray-900"></span>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_static) && (
                <button
                  onClick={() => displayPanel()}
                  type="button"
                  className="bg-uiMid hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Create {type}
                </button>
              )}
            </div>
          </div>

          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'description', use: 'description' },
                    { field: 'locale', use: 'locale' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_static) && displayPanel
                  }
                  deleteRow={
                    hasPermission(PermissionEnum.delete_static) &&
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
