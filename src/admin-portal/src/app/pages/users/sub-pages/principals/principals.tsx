import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  PractitionerDto,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { GetAllPrincipal, SendInviteToApplication } from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { Menu, Transition } from '@headlessui/react';
import { CogIcon } from '@heroicons/react/outline';
import { Fragment, useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import PrincipalPanelCreate from './components/principal-panel-create/principal-panel-create';
import PrincipalPanelEdit from './components/principal-panel-edit/principal-panel-edit';

export default function Practitioners() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data, refetch } = useQuery(GetAllPrincipal, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  const panel = usePanel();

  useEffect(() => {
    if (data && data.GetAllPrincipal) {
      const copyItems = data.GetAllPrincipal.map((item: PractitionerDto) => ({
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
      title: 'Create Principal',
      render: (onSubmit: any) => (
        <PrincipalPanelCreate
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

  const displayEditPanel = (practitioner: PractitionerDto) => {
    panel({
      noPadding: true,
      title: 'Edit Principal',
      render: (onSubmit: any) => (
        <PrincipalPanelEdit
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

  const sendInvite = async (principal: PractitionerDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Principal Invite"
          message={`You are about to send an invite to ${principal.user.firstName} ${principal.user.surname}`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: principal.userId,
                inviteToPortal: false,
              },
            }).then(() => {
              setNotification({
                title: 'Successfully Sent Principal Invite!',
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
            <div className="flex flex-row">
              <div className="mt-3 sm:mt-0 sm:ml-4">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={displayPanel}
                    type="button"
                    className="bg-uiMid hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                  >
                    Create Principal
                  </button>
                )}
              </div>
              {hasPermission(PermissionEnum.create_user) && (
                <div className="flex flex-col">
                  <div className="ml-4">
                    <Menu as="div" className=" inline-block text-right">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button
                              type="button"
                              className="bg-uiMid hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                            >
                              <span className="sr-only">Open options</span>
                              <CogIcon className="h-5 w-5" aria-hidden="true" />
                            </Menu.Button>
                          </div>

                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            {/* <Menu.Items
                              static
                              className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <div className="py-1">
                                <Menu.Item>
                                  <div
                                    onClick={() =>
                                      downloadContentTypeTemplate()
                                    }
                                    className="text-gray-700 flex px-4 py-2 text-sm cursor-pointer"
                                  >
                                    <DownloadIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    Download template
                                  </div>
                                </Menu.Item>
                                <Menu.Item>
                                  <div
                                    onClick={() => UploadContent()}
                                    className="text-gray-700 flex px-4 py-2 text-sm cursor-pointer"
                                  >
                                    <UploadIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    Upload template
                                  </div>
                                </Menu.Item>
                              </div>
                            </Menu.Items> */}
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
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
