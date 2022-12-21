import { useQuery } from '@apollo/client';
import { PermissionEnum } from '@ecdlink/core';
import { TeamLeadDto } from '@ecdlink/core/lib/models/dto/Users/team-lead.dto';
import { usePanel } from '@ecdlink/core/lib/services/panel/PanelService';
import { GetAllTeamLead } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import TeamLeadPanelCreate from './team-lead-panel-create/team-lead-panel-creat';

export default function TeamLeads() {
  const { data, refetch } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const panel = usePanel();
  const { hasPermission } = useUser();

  useEffect(() => {
    if (data && data.GetAllTeamLead) {
      const copyItems = data.GetAllTeamLead.map((item: TeamLeadDto) => ({
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

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Team Lead',
      render: (onSubmit: any) => (
        <TeamLeadPanelCreate
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
                  className="bg-uiMid hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Create Team Lead
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
                    { field: 'idNumber', use: 'id / Passport' },
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
