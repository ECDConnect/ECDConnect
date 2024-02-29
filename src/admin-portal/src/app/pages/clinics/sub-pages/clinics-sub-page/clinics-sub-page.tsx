import { useQuery, useMutation } from '@apollo/client';
import {
  CoachDto,
  PermissionEnum,
  usePanel,
  useDialog,
  useNotifications,
  NOTIFICATION,
  ClinicDto,
} from '@ecdlink/core';
import debounce from 'lodash.debounce';
import { GetAllClinic, SendInviteToApplication } from '@ecdlink/graphql';
import { DialogPosition, Dropdown } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import { SearchIcon } from '@heroicons/react/solid';
import { CreateClinicPanel } from '../../components/create-clinic-panel/create-clinic-panel';

export default function ClinicsSubPage() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const { data, refetch } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showFilter, setShowFilter] = useState(false);
  const [showDropDownFilter, setShowDropDownFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState(true);

  const clearFilters = () => {
    setStatusFilter('');
    setNameFilter(false);
  };

  const [tableData, setTableData] = useState<any[]>([]);

  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  useEffect(() => {
    if (data && data.GetAllClinic) {
      const copyItems = data.GetAllClinic.filter(
        (v) => v?.isActive === true
      ).map((item: ClinicDto) => ({
        ...item,
        id: `${item?.id}`,
        name: item?.name,
        isActive: item?.isActive,
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
      title: 'Add a clinic',
      render: (onSubmit: any) => (
        <CreateClinicPanel
          key={`clinicPanelCreate`}
          closeDialog={(clinicCreated: boolean) => {
            onSubmit();

            if (clinicCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  // const displayEditPanel = (coach: CoachDto) => {
  //   panel({
  //     noPadding: true,
  //     title: 'Edit Coach',
  //     render: (onSubmit: any) => (
  //       <CoachPanelEdit
  //         coach={coach}
  //         key={`coachPanelEdit`}
  //         closeDialog={(userCreated: boolean) => {
  //           onSubmit();

  //           if (userCreated) {
  //             refetch();
  //           }
  //         }}
  //       />
  //     ),
  //   });
  // };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

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
            <div className="text-body w-8/12 sm:flex  sm:justify-around">
              <div className="text-body w-8/12 flex-col sm:flex sm:justify-around">
                <div className="relative w-full">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="         Search by unique ID or clinic name..."
                    onChange={search}
                  />
                </div>
                {showFilter && (
                  <div className="mt-4 flex flex-row items-center justify-between sm:mt-6">
                    <div className=" w-6/12">
                      <Dropdown
                        fillType="filled"
                        textColor="white"
                        fillColor="secondary"
                        placeholder="Filter By Name"
                        labelColor="white"
                        selectedValue={nameFilter}
                        list={[
                          { label: 'Ascending', value: false },
                          { label: 'Descending', value: true },
                        ]}
                        onChange={(item) => {
                          setNameFilter(item);
                        }}
                        className="p-2"
                      />
                    </div>

                    <div>
                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setShowDropDownFilter(!showDropDownFilter)
                            }
                            className={`border-secondary inline-flex w-full justify-center gap-x-1.5 rounded-md border-2 px-3 py-2 text-sm font-normal ${
                              !showDropDownFilter
                                ? 'bg-secondary text-white'
                                : 'text-secondary border-secondary border-2 bg-white'
                            } hover:text-secondary hover:bg-white `}
                            id="menu-button"
                            aria-expanded={showDropDownFilter}
                            aria-haspopup={showDropDownFilter}
                          >
                            {statusFilter === ''
                              ? 'Filter by status'
                              : statusFilter}
                            <svg
                              className={`-mr-1 h-5 w-5 hover:text-white ${
                                !showDropDownFilter
                                  ? 'hover:text-secondary text-white'
                                  : 'text-secondary hover:text-white'
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
                        {showDropDownFilter && (
                          <div
                            className="focus:outline-none absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                            role="menu"
                            aria-orientation="horizontal"
                            aria-labelledby="menu-button"
                          >
                            <div className="py-1" role="none">
                              {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                              <a
                                onClick={() => {
                                  setStatusFilter('active');
                                  setShowDropDownFilter(!showDropDownFilter);
                                }}
                                className=" focus:bg-secondary block cursor-auto px-4 py-2 text-sm text-gray-700 focus:text-white"
                                role="menuitem"
                                id="menu-item-0"
                              >
                                Active
                              </a>
                              <a
                                onClick={() => {
                                  setStatusFilter('inactive');
                                  setShowDropDownFilter(!showDropDownFilter);
                                }}
                                className="focus:bg-secondary block cursor-auto px-4 py-2 text-sm text-gray-700 focus:text-white"
                                role="menuitem"
                                id="menu-item-1"
                              >
                                Inactive
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="justify-self col-end-3 ">
                      <button
                        onClick={clearFilters}
                        type="button"
                        className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white  "
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mx-4 w-3/12">
                <span className="w-full text-lg font-medium leading-6 text-gray-900">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    id="dropdownHoverButton"
                    className="bg-secondary focus:border-secondary focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
                    type="button"
                  >
                    Filter
                    <svg
                      className="ml-2 h-4 w-4"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              {hasPermission(PermissionEnum.create_user) && (
                <button
                  onClick={displayPanel}
                  type="button"
                  className="bg-secondary hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  + Add a Clinic
                </button>
              )}
            </div>
          </div>

          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'id', use: 'Unique ID' },
                    { field: 'name', use: 'Name' },
                    { field: 'teamLead', use: 'teamLead(s)' },
                    { field: 'subDistrict', use: 'Sub-district' },
                    { field: 'insertedDate', use: 'Date added' },
                  ]}
                  rows={tableData}
                  // editRow={
                  //   hasPermission(PermissionEnum.update_user) &&
                  //   displayEditPanel
                  // }
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
