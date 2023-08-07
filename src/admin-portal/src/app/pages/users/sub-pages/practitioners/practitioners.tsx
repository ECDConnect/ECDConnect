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
import {
  CogIcon,
  DownloadIcon,
  SearchIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import { Fragment, useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/old-ui-table';
import { useUser } from '../../../../hooks/useUser';
import PractitionerPanelCreate from './components/practitioner-panel-create/practitioner-panel-create';
import PractitionerPanelEdit from './components/practitioner-panel-edit/practitioner-panel-edit';
import UploadPractitionerTemplate from './components/upload-template/upload-template';
import UploadAllImportTemplate from './components/upload-import-template/upload-import-template';
import UploadAllChildrenTemplate from './components/upload-import-template-children/upload-import-template-children';
import debounce from 'lodash.debounce';

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
      const copyItems = data.GetAllPractitioner.filter(
        (v) => v.user !== null && v.user.isActive === true
      ).map((item: PractitionerDto) => ({
        ...item,
        fullName: `${item.user?.firstName} ${item.user?.surname}`,
        isActive: item.user?.isActive,
        isPrinicpal: item?.isPrincipal,
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
                inviteToPortal: false,
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

  const UploadContentImport = () => {
    panel({
      noPadding: true,
      title: `Import Users`,
      render: (onSubmit: any) => (
        <UploadAllImportTemplate
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

  const UploadContentImportChildren = () => {
    panel({
      noPadding: true,
      title: `Import Children`,
      render: (onSubmit: any) => (
        <UploadAllChildrenTemplate
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

  const [searchValue, setSearchValue] = useState('');

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);
  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-evenly">
            <span className="text-lg font-medium leading-6 text-gray-900"></span>
            <div className="relative w-11/12">
              <span className="absolute inset-y-1/2 left-3 mr-0 flex -translate-y-1/2 transform items-center">
                <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
              </span>
              <input
                onClick={search}
                className="bg-uiBg focus:outline-none sm:text-md block w-6/12 rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                placeholder="       Search"
              />
            </div>
            <div className="flex-row-end flex w-2/12">
              <div className="mt-3 sm:mt-0 sm:ml-0">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={displayPanel}
                    type="button"
                    className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
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
                            <Menu.Items
                              static
                              className="focus:outline-none absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                            >
                              <div className="py-1">
                                <Menu.Item>
                                  <div
                                    onClick={() =>
                                      downloadContentTypeTemplate()
                                    }
                                    className="flex cursor-pointer px-4 py-2 text-sm text-gray-700"
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
                                    className="flex cursor-pointer px-4 py-2 text-sm text-gray-700"
                                  >
                                    <UploadIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    Upload Practitioners
                                  </div>
                                </Menu.Item>
                                <Menu.Item>
                                  <div
                                    onClick={() => UploadContentImport()}
                                    className="flex cursor-pointer px-4 py-2 text-sm text-gray-700"
                                  >
                                    <UploadIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    Import Users
                                  </div>
                                </Menu.Item>
                                <Menu.Item>
                                  <div
                                    onClick={() =>
                                      UploadContentImportChildren()
                                    }
                                    className="flex cursor-pointer px-4 py-2 text-sm text-gray-700"
                                  >
                                    <UploadIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    Import Children Classes
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
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'idNumber', use: 'id / Passport' },
                    { field: 'fullName', use: 'name' },
                    { field: 'isActive', use: 'Active' },
                    { field: 'isPrincipal', use: 'Principal' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_user) &&
                    displayEditPanel
                  }
                  sendRow={
                    hasPermission(PermissionEnum.update_user) && sendInvite
                  }
                  searchInput={searchValue}
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
