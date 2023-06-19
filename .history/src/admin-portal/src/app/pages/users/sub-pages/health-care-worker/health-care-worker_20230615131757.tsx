import { useMutation, useQuery } from '@apollo/client';
import {
  NOTIFICATION,
  PermissionEnum,
  TeamLeadDto,
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
} from '@ecdlink/graphql';
import { DialogPosition, Dropdown } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import HealthCareWorkerPanelCreate from './components/health-care-worker-panel-create/health-care-worker-panel-create';
import { ChevronDownIcon, PlusIcon, SearchIcon } from '@heroicons/react/solid';

export default function HealthCareWorkers() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data, refetch } = useQuery(GetAllHealthCareWorker, {
    fetchPolicy: 'cache-and-network',
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
  const [tableData, setTableData] = useState<any[]>([]);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const panel = usePanel();
  const [statusFilter, setStatusFilter] = useState('');
  const [teamLeadFilter, setTeamLeadFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };


  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const teamLeads = teamLeadData?.GetAllTeamLead.map((x: TeamLeadDto) => {
    return {
      key: x.id,
      value: x.user.firstName + ' ' + x.user.surname,
    };
  });

  const clinincs = clinicData?.GetAllClinics.map((x: TeamLeadDto) => {
    return {
      key: x.id,
      value: x.user.firstName + ' ' + x.user.surname,
    };
  });

  const provinces = teamLeadData?.GetAllTeamLead.map((x: TeamLeadDto) => {
    return {
      key: x.id,
      value: x.user.firstName + ' ' + x.user.surname,
    };
  });

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




  if (tableData) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <div className="text-body w-full sm:flex  sm:justify-around">
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
                  <div className="flex items-center  w-full">

                    <div>
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="CHW Connect usage"
                        labelColor="white"
                        selectedValue={statusFilter}
                        list={[
                          { label: 'All', value: '' },
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                        onChange={(item) => {
                          setStatusFilter(item);
                        }}
                        className='p-2'
                      />
                    </div>



                    <div>
                      <Dropdown

                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="App visit activity"
                        labelColor="white"
                        selectedValue={statusFilter}
                        list={[
                          { label: 'All', value: '' },
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                        onChange={(item) => {
                          setStatusFilter(item);
                        }}
                        className='p-2'
                      />
                    </div>


                    {/* <div>
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="Clinic"
                        labelColor="white"
                        selectedValue={statusFilter}
                        list={
                          clinicData &&
                          clinicData.GetAllTeamLead &&
                          clinicData.GetAllClinics.map((x: TeamLeadDto) => {
                            return {
                              key: x.id,
                              value: x.user.firstName + ' ' + x.user.surname,
                            };
                          })}
                        onChange={(item) => {
                          setStatusFilter(item);
                        }}
                        className='p-2'
                      />
                    </div> */}

                    <div>
                      <Dropdown
                        showSearch
                        fillType="filled"

                        fillColor="secondary"
                        placeholder="Sub-district"
                        labelColor="white"
                        selectedValue={statusFilter}
                        list={[
                          { label: 'All', value: '' },
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                        onChange={(item) => {
                          setStatusFilter(item);
                        }}
                        className='p-2 text-white'
                      />
                    </div>


                    <div className='w-60'>
                      <Dropdown
                        showSearch
                        fullWidth
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder={teamLeadFilter !== '' ? teamLeadFilter : "Team Lead"}
                        labelColor="white"
                        selectedValue={teamLeadFilter}
                        list={
                          teamLeads.map((item: any) => ({
                            label: item.value,
                            value: item.value.toLowerCase()
                          })) || []
                        }
                        onChange={(item) => {
                          setTeamLeadFilter(item);
                          console.log(">>>", item)
                        }}
                        className='p-2'
                      />
                    </div>


                    <div>
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="Filter by status"
                        labelColor="white"
                        selectedValue={statusFilter}
                        list={[
                          { label: 'All', value: '' },
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                        onChange={(item) => {
                          setStatusFilter(item);
                        }}
                        className='p-2'
                      />
                    </div>


                  </div>
                )}
              </div>

              <div className="w-2/12">

                <button onClick={() => setShowFilter(!showFilter)} id="dropdownHoverButton"
                  className="text-white bg-secondary hover:bg-gray-300 focus:border-secondary focus:ring-2 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary"
                  type="button">Filter
                  <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

              </div>
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
                        <PlusIcon className="mr-4 h-5 w-5"> </PlusIcon>
                        Add CHWs
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
