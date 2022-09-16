import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { HealthCareWorkerDto } from '@ecdlink/core/lib/models/dto/Users/health-care-worker.dto';
import {
  SendInviteToApplication,
  GetAllHealthCareWorker,
} from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import HealthCareWorkerPanelCreate from './components/health-care-worker-panel-create/health-care-worker-panel-create';
import HealthCareWorkerPanelEdit from './components/health-care-worker-panel-edit/practitioner-panel-edit';

export default function HealthCareWorkers() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data, refetch } = useQuery(GetAllHealthCareWorker, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();

  useEffect(() => {
    if (data && data.GetAllHealthCareWorker) {
      const copyItems = data.GetAllHealthCareWorker.map(
        (item: HealthCareWorkerDto) => ({
          ...item,
          fullName: `${item.user?.firstName} ${item.user?.surname}`,
          isActive: item.user?.isActive,
          idNumber: item.user?.idNumber,
          _view: undefined,
          _edit: undefined,
          _url: undefined,
        })
      );
      setTableData(copyItems);
    }
  }, [data]);

  const sendInvite = async (practitioner: HealthCareWorkerDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Health Worker Invite"
          message={`You are about to send an invite to ${practitioner.user.firstName} ${practitioner.user.surname}`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: practitioner.userId,
              },
            }).then(() => {
              setNotification({
                title: 'Successfully Sent Health Worker Invite!',
                variant: NOTIFICATION.SUCCESS,
              });
            });
          }}
        />
      ),
    });
  };

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Health Worker',
      render: (onSubmit: any) => (
        <HealthCareWorkerPanelCreate
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

  const displayEditPanel = (practitioner: HealthCareWorkerDto) => {
    panel({
      noPadding: true,
      title: 'Edit Practitioner',
      render: (onSubmit: any) => (
        <HealthCareWorkerPanelEdit
          practitioner={practitioner}
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
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <span className="text-lg leading-6 font-medium text-gray-900"></span>
            <div className="flex flex-row">
              <div className="mt-3 sm:mt-0 sm:ml-4">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={displayPanel}
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Create Health Worker
                  </button>
                )}
              </div>
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
                  sendRow={
                    hasPermission(PermissionEnum.update_user) && sendInvite
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
