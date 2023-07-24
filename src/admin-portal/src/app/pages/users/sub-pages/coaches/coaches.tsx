import { useQuery, useMutation } from '@apollo/client';
import {
  CoachDto,
  PermissionEnum,
  usePanel,
  useDialog,
  useNotifications,
  NOTIFICATION,
} from '@ecdlink/core';
import { GetAllCoach, SendInviteToApplication } from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import CoachPanelCreate from './coach-panel-create/coach-panel-create';
import CoachPanelEdit from './coach-panel-edit/coach-panel-edit';

export default function Coaches() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data, refetch } = useQuery(GetAllCoach, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  useEffect(() => {
    if (data && data.GetAllCoach) {
      const copyItems = data.GetAllCoach.filter(
        (v) => v.user !== null && v.user.isActive === true
      ).map((item: CoachDto) => ({
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
      title: 'Create Coach',
      render: (onSubmit: any) => (
        <CoachPanelCreate
          key={`coachPanelCreate`}
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

  const displayEditPanel = (coach: CoachDto) => {
    panel({
      noPadding: true,
      title: 'Edit Coach',
      render: (onSubmit: any) => (
        <CoachPanelEdit
          coach={coach}
          key={`coachPanelEdit`}
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

  const sendInvite = async (coach: CoachDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Coach Invite"
          message={`You are about to send an invite to ${coach.user.firstName} ${coach.user.surname}`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: coach.userId,
                inviteToPortal: false,
              },
            }).then(() => {
              setNotification({
                title: 'Successfully Sent Coach Invite!',
                variant: NOTIFICATION.SUCCESS,
              });
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
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Create Coach
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
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditPanel
                  }
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
