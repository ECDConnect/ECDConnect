import { useQuery } from '@apollo/client';
import { FranchisorDto, PermissionEnum, usePanel } from '@ecdlink/core';
import { GetAllFranchisor } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import FranchisorPanelCreate from './franchisor-panel-create/franchisor-panel-create';
import FranchisorPanelEdit from './franchisor-panel-edit/franchisor-panel-edit';

export default function Franchisors() {
  const { hasPermission } = useUser();
  const { data, refetch } = useQuery(GetAllFranchisor, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.GetAllFranchisor) {
      const copyItems = data.GetAllFranchisor.filter(
        (v) => v.user !== null && v.user.isActive === true
      )
        .sort((q) => q.user.firstName)
        .map((item: FranchisorDto) => ({
          ...item,
          fullName: `${item.user?.firstName} ${item.user?.surname}`,
          isActive: item.user?.isActive,
          idNumber: item.user?.idNumber,
          _view: undefined,
          _edit: undefined,
          _url: undefined,
        }));
      setTableData(copyItems);
    }
  }, [data]);

  const panel = usePanel();
  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Franchisor',
      render: (onSubmit: any) => (
        <FranchisorPanelCreate
          key={`franchisorPanelCreate`}
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

  const displayEditPanel = (franchisor: FranchisorDto) => {
    panel({
      noPadding: true,
      title: 'Edit Franchisor',
      render: (onSubmit: any) => (
        <FranchisorPanelEdit
          franchisor={franchisor}
          key={`franchisorPanelEdit`}
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

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg leading-6 font-medium text-gray-900"></span>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Create Franchisor
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
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditPanel
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
