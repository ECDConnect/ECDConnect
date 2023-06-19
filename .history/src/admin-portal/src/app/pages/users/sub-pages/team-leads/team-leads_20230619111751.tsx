import { useQuery } from '@apollo/client';
import { PermissionEnum } from '@ecdlink/core';
import { TeamLeadDto } from '@ecdlink/core/lib/models/dto/Users/team-lead.dto';
import { usePanel } from '@ecdlink/core/lib/services/panel/PanelService';
import { GetAllTeamLead } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import TeamLeadPanelCreate from './team-lead-panel-create/team-lead-panel-create';
import { SearchIcon } from '@heroicons/react/solid';
import { Dropdown } from '@ecdlink/ui';
import debounce from 'lodash.debounce';
export default function TeamLeads() {
  const { data, refetch } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const panel = usePanel();
  const { hasPermission } = useUser();
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

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
          <div className="text-body w-10/12 sm:flex  sm:justify-around">
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

            <div className="w-/12">

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
                      Create Team Lead
                    </button>
                  )}
                </div>
              </div>
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
                  urlRow={'/view-user/'}
                  component={"Team Leads"}
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
