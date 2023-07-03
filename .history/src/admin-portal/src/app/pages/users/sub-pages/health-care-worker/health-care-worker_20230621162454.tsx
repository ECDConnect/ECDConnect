import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  ClinicDto,
  NOTIFICATION,
  PermissionEnum,
  TeamLeadDto,
  UserDto,
  b64toBlob,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import debounce from 'lodash.debounce';

import { HealthCareWorkerDto } from '@ecdlink/core/lib/models/dto/Users/health-care-worker.dto';
import {
  SendInviteToApplication,
  GetAllHealthCareWorker,
  GetAllTeamLead,
  GetAllClinic,
  GetAllProvince,
  practitionerExcelTemplateGenerator,
} from '@ecdlink/graphql';
import { DialogPosition, Dropdown } from '@ecdlink/ui';
import { Fragment, useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import UploadAllImportTemplate from './components/upload-import-template/upload-import-template';
import { useUser } from '../../../../hooks/useUser';
import HealthCareWorkerPanelCreate from './components/health-care-worker-panel-create/health-care-worker-panel-create';
import { ChevronDownIcon, CogIcon, DownloadIcon, PlusIcon, SearchIcon, UploadIcon } from '@heroicons/react/solid';
import HealthCareWorkerPanelEdit from './components/health-care-worker-panel-edit/hcw-panel-edit';
import UploadAllChildrenTemplate from '../practitioners/components/upload-import-template-children/upload-import-template-children';
import UploadPractitionerTemplate from '../practitioners/components/upload-template/upload-template';
import { Menu, Transition } from '@headlessui/react';

export default function HealthCareWorkers() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();

  const { data, refetch, loading } = useQuery(GetAllHealthCareWorker, {
    variables: {
      pageNumber: 1,
      pageSize: 10,
      filterBy: [
        { fieldName: "ADMINISTRATOR", filterType: "EQUALS", value: "true" }
      ],
      sortBy: [{ fieldName: "FullName", descending: true }]
    }
  });

  const { data: teamLeadData } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: clinicData } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const [getPractitionerExcelTemplateGenerator, { data: templateData }] =
    useLazyQuery(practitionerExcelTemplateGenerator, {
      fetchPolicy: 'cache-and-network',
    });

  const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);

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

  const [tableData, setTableData] = useState<any[]>([]);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();
  const [statusFilter, setStatusFilter] = useState('');
  const [teamLeadFilter, setTeamLeadFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showProvinceFilter, setShowProvinceFilter] = useState(false);
  const [showDropDownFilter, setShowDropDownFilter] = useState(false);


  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const teamLeads = teamLeadData?.GetAllTeamLead.map((x: TeamLeadDto) => {
    return {
      key: x.id,
      value: x.user.firstName + ' ' + x.user.surname,
    };
  });

  const clinics = clinicData?.GetAllClinic.map((x: ClinicDto) => {
    return {
      key: x.id,
      value: x.name,
    };
  });
  console.log(clinics)

  const provinces = provinceData?.GetAllProvince.map((x: any) => {
    return {
      key: x.id,
      value: x.description,
    };
  });

  const mapUserTableItem = (item: any) => {
    return {
      ...item,
      fullName: `${item.user?.firstName} ${item.user?.surname}`,
      isActive: item.user?.isActive,
      idNumber: item.user?.idNumber,
      _view: undefined,
      _edit: undefined,
      _url: undefined,
    };
  };

  useEffect(() => {
    if (!data?.users) return;
    let userStatus = statusFilter === 'active' ? true : false

    let allUsers: UserDto[] = [...data.users];
    setTableData(
      allUsers.filter((v) => v.isActive === (statusFilter === '' ? true : userStatus)).map(mapUserTableItem)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (data && data.GetAllHealthCareWorker) {
      const copyItems = data.GetAllHealthCareWorker.map(
        (item: HealthCareWorkerDto) => (mapUserTableItem(item))
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

  const displayEditUserPanel = (user: any) => {
    panel({
      noPadding: true,
      title: '',
      presentationStyle: 'overFullScreen',
      render: (onSubmit) => (
        <HealthCareWorkerPanelEdit
          key={`userPanelEdit`}
          practitioner={user}
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

  // const UploadContentImport = () => {
  //   panel({
  //     noPadding: true,
  //     title: `Import Users`,
  //     render: (onSubmit: any) => (
  //       <UploadAllImportTemplate
  //         closeDialog={(created: boolean) => {
  //           onSubmit();

  //           if (created) {
  //             refetch();
  //           }
  //         }}
  //       />
  //     ),
  //   });
  // };

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

  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-8/12 sm:flex  sm:justify-around">
              <div className="text-body w-8/12 sm:flex flex-col sm:justify-around">
                <div className="relative w-full">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by email or name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="flex items-center mt-4 sm:mt-6 flex-row ">
                    <div className="relative inline-block text-left pr-2">
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowProvinceFilter(!showProvinceFilter)}
                          className={`inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-normal border-2 border-secondary ${!showProvinceFilter ? 'text-white bg-secondary' : 'text-secondary bg-white border-2 border-secondary'
                            } hover:bg-white hover:text-secondary `}
                          id="menu-button"
                          aria-expanded={showProvinceFilter}
                          aria-haspopup={showProvinceFilter}
                        >
                          {statusFilter === '' ? "Filter by Province" : statusFilter}
                          <svg
                            className={`-mr-1 h-5 w-5 hover:text-white ${!showProvinceFilter ? 'text-white hover:text-secondary' : 'text-secondary hover:text-white'
                              }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      {/*  */}
                      {showProvinceFilter && <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="horizontal" aria-labelledby="menu-button" >
                        <div className="py-1" role="none">
                          {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                          <a onClick={() => { setStatusFilter('active'); setShowDropDownFilter(!showProvinceFilter); }} className=" cursor-auto text-gray-700 block px-4 py-2 text-sm focus:bg-secondary focus:text-white" role="menuitem" id="menu-item-0">Active</a>
                          <a onClick={() => { setStatusFilter('inactive'); setShowProvinceFilter(!showProvinceFilter) }} className="cursor-auto text-gray-700 block px-4 py-2 text-sm focus:bg-secondary focus:text-white" role="menuitem" id="menu-item-1">Inactive</a>

                        </div>
                      </div>}
                    </div>

                    <div>

                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            onClick={() => setShowDropDownFilter(!showDropDownFilter)}
                            className={`inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-normal border-2 border-secondary ${!showDropDownFilter ? 'text-white bg-secondary' : 'text-secondary bg-white border-2 border-secondary'
                              } hover:bg-white hover:text-secondary `}
                            id="menu-button"
                            aria-expanded={showDropDownFilter}
                            aria-haspopup={showDropDownFilter}
                          >
                            {statusFilter === '' ? "Filter by status" : statusFilter}
                            <svg
                              className={`-mr-1 h-5 w-5 hover:text-white ${!showDropDownFilter ? 'text-white hover:text-secondary' : 'text-secondary hover:text-white'
                                }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        {/*  */}
                        {showDropDownFilter && <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="horizontal" aria-labelledby="menu-button" >
                          <div className="py-1" role="none">
                            {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                            <a onClick={() => { setStatusFilter('active'); setShowDropDownFilter(!showDropDownFilter); }} className=" cursor-auto text-gray-700 block px-4 py-2 text-sm focus:bg-secondary focus:text-white" role="menuitem" id="menu-item-0">Active</a>
                            <a onClick={() => { setStatusFilter('inactive'); setShowDropDownFilter(!showDropDownFilter) }} className="cursor-auto text-gray-700 block px-4 py-2 text-sm focus:bg-secondary focus:text-white" role="menuitem" id="menu-item-1">Inactive</a>

                          </div>
                        </div>}
                      </div>

                    </div>

                    <div className='flex ml-60'>
                      <div className="">
                        <button
                          onClick={() => setStatusFilter('')}
                          type="button"
                          className="text-secondary hover:bg-secondary hover:text-white outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm "
                        >
                          Clear All
                        </button>
                      </div>

                    </div>


                  </div>
                )}
              </div>

              <div className="mx-4 w-3/12">
                <span className="w-full text-lg font-medium leading-6 text-gray-900">

                  <button onClick={() => setShowFilter(!showFilter)} id="dropdownHoverButton"
                    className="text-white bg-secondary hover:bg-gray-300 focus:border-secondary focus:ring-2 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary"
                    type="button">Filter
                    <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                </span>
              </div>

            </div>

            <div className="mt-3  sm:mt-0 sm:ml-4 flex flex-row justify-">
              <div className="mt-3 w-auto pr-5">
                {hasPermission(PermissionEnum.create_user) && (
                  <button
                    onClick={displayPanel}
                    type="button"
                    className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                  >
                    <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                    Add CHWs
                  </button>
                )}
              </div>
              {hasPermission(PermissionEnum.create_user) && (
                <div className="flex flex-col mt-3">
                  <div className="">
                    <Menu as="div" className=" inline-block text-right">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button
                              type="button"
                              className="bg-primary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                            >
                              <UploadIcon
                                className="h-5 w-5 "
                                aria-hidden="true"
                              />
                              <span className="">Upload</span>


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
                    { field: 'usage', use: 'CHW Connect usage' },
                    { field: 'InsertedDate', use: 'Date invited' },
                    { field: 'isActive', use: 'Active' },
                  ]}
                  rows={tableData}
                  sendRow={
                    hasPermission(PermissionEnum.update_user) && sendInvite
                  }
                  searchInput={searchValue}
                  viewRow={true}
                  urlRow={'/view-user/'}
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


