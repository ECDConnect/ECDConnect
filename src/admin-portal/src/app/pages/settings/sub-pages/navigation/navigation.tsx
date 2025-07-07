import { useQuery } from '@apollo/client';
import { NavigationDto, PermissionEnum, usePanel } from '@ecdlink/core';
import { GetAllNavigation } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/old-ui-table';
import { useUser } from '../../../../hooks/useUser';
import NavigationPanel from './components/navigation-panel/navigation-panel';

export default function NavigationSetup() {
  const type = 'Navigation';
  const { hasPermission } = useUser();
  const { data, refetch } = useQuery(GetAllNavigation, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  const panel = usePanel();

  useEffect(() => {
    if (data && data.GetAllNavigation) {
      const copyItems = data.GetAllNavigation.map((item) => ({
        ...item,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const displayPanel = (item?: NavigationDto) => {
    panel({
      noPadding: true,
      title: item ? `Edit ${type}` : `Create ${type}`,
      render: (onSubmit: any) => (
        <NavigationPanel
          item={item}
          closeDialog={(result: boolean) => {
            refetch();
            onSubmit();
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
              {hasPermission(PermissionEnum.create_system) && (
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
                    { field: 'sequence', use: 'sequence' },
                    { field: 'name', use: 'name' },
                    { field: 'route', use: 'route' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_system) && displayPanel
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
