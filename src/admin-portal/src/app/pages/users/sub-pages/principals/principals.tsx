import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  b64toBlob,
  NOTIFICATION,
  PermissionEnum,
  PractitionerDto,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import {
  GetAllPractitioner,
  practitionerExcelTemplateGenerator,
  SendInviteToApplication,
} from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import { Menu, Transition } from '@headlessui/react';
import { CogIcon, DownloadIcon, UploadIcon } from '@heroicons/react/outline';
import { Fragment, useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import PractitionerPanelCreate from './components/principal-panel-create/principal-panel-create';
import PractitionerPanelEdit from './components/principal-panel-edit/principal-panel-edit';
import UploadPractitionerTemplate from './components/upload-template/upload-template';

export default function Practitioners() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data, refetch } = useQuery(GetAllPractitioner, {
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  const [getPractitionerExcelTemplateGenerator, { data: templateData }] =
    useLazyQuery(practitionerExcelTemplateGenerator, {
      fetchPolicy: 'cache-and-network',
    });

  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);
  const panel = usePanel();

  useEffect(() => {
    if (
      templateData &&
      templateData.practitionerExcelTemplateGenerator &&
      !templateDownloaded
    ) {
      const b64Data =
        templateData.practitionerExcelTemplateGenerator.base64File;
      const contentType =
        templateData.practitionerExcelTemplateGenerator.fileType;
      const fileName = templateData.practitionerExcelTemplateGenerator.fileName;
      const extension =
        templateData.practitionerExcelTemplateGenerator.extension;
      const blob = b64toBlob(b64Data, contentType);

      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}${extension}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTemplateDownloaded(true);
    }
  }, [templateData, templateDownloaded]);

  useEffect(() => {
    if (data && data.GetAllPractitioner) {
      const copyItems = data.GetAllPractitioner.map(
        (item: PractitionerDto) => ({
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

  const displayPanel = () => {
    panel({
      noPadding: true,
      title: 'Create Practitioner',
      render: (onSubmit: any) => (
        <PractitionerPanelCreate
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
      title: 'Edit Practitioner',
      render: (onSubmit: any) => (
        <PractitionerPanelEdit
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

  const sendInvite = async (practitioner: PractitionerDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Practitioner Invite"
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
                title: 'Successfully Sent Practitioner Invite!',
                variant: NOTIFICATION.SUCCESS,
              });
            });
          }}
        />
      ),
    });
  };

  const downloadContentTypeTemplate = async () => {
    setTemplateDownloaded(false);
    await getPractitionerExcelTemplateGenerator();
  };

  const UploadContent = () => {
    panel({
      noPadding: true,
      title: `Upload Practitioners`,
      render: (onSubmit: any) => (
        <UploadPractitionerTemplate
          closeDialog={(created: boolean) => {
            onSubmit();

            if (created) {
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
                    Create Practitioner
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
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                            <Menu.Items
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
                            </Menu.Items>
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
