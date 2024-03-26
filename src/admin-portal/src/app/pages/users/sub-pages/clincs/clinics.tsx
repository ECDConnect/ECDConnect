import { useQuery } from '@apollo/client';
import { ClinicDto, PermissionEnum, usePanel } from '@ecdlink/core';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import ClinicPanelCreate from './clinic-panel-create/clinic-panel-create';

export default function Clinics() {
  const { data, refetch } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const { hasPermission } = useUser();
  const panel = usePanel();

  useEffect(() => {
    if (data && data.GetAllPortalClinics) {
      const copyItems = data.GetAllPortalClinics.map((item: ClinicDto) => ({
        ...item,
        fullName: item.name,
        // isActive: item.isActive,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
  }, [data]);

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Clinic',
      render: (onSubmit: any) => (
        <ClinicPanelCreate
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

  if (tableData) {
    return (
      <div>
        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <span className="text-lg font-medium leading-6 text-gray-900"></span>
          <div className="flex flex-row">
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Create Clinic
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'fullName', use: 'name' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  rows={tableData}
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
