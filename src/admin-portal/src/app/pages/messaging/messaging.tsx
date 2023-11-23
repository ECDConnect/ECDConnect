import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import {
  PermissionEnum,
  usePanel,
  LocalStorageKeys,
  AuthUser,
  RoleDto,
  MessageLogDto,
} from '@ecdlink/core';
import MessagePanel from './components/message-panel';
import { MailIcon, SearchIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import debounce from 'lodash.debounce';
import UiTable from '../../components/old-ui-table';
import { FilterRoleList, MessageList } from '@ecdlink/graphql';
import { useQuery } from '@apollo/client';
import {
  SearchDropDown,
  SearchDropDownOption,
  Dropdown,
  DatePicker,
} from '@ecdlink/ui';
import { format } from 'date-fns';

export default function Messaging() {
  const { hasPermission } = useUser();
  const panel = usePanel();
  const history = useHistory();

  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedPageSize, setSelectedPageSize] = useState<number>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser>();
  const [searchValue, setSearchValue] = useState('');
  const [roleData, setRoleData] = useState<RoleDto[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState<Date>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleDto[]>([]);
  const user = localStorage.getItem(LocalStorageKeys.user);

  useEffect(() => {
    if (user) {
      setAuthenticatedUser(JSON.parse(user));
    }
  }, [user]);

  const { data: roles } = useQuery(FilterRoleList, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: messages, refetch } = useQuery(MessageList, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: authenticatedUser?.id,
    },
  });

  useEffect(() => {
    if (roles) {
      setRoleData(roles.roles);
    }
    if (messages) {
      const copyItems = messages.allMessageLogsForAdmin.map(
        (item: MessageLogDto) => ({
          ...item,
          message: item.message,
          subject: item.subject,
          messageDate:
            item.messageDate !== null
              ? format(new Date(item.messageDate), 'dd MMM yyyy hh:mm')
              : '',
          status: item.messageDate > new Date() ? 'Scheduled' : 'Sent',
        })
      );

      setTableData(copyItems);
    }
  }, [roles, messages]);

  const displayMessagePanel = () => {
    panel({
      noPadding: false,
      title: 'Send a message',
      render: (onSubmit: any) => (
        <MessagePanel
          isView={false}
          closeDialog={(messageCreated: boolean) => {
            onSubmit();
            if (messageCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const displayEditViewMessagePanel = (message: MessageLogDto) => {
    var messageDate = new Date(message.messageDate);
    var messageTitle =
      messageDate < new Date() ? 'View message' : 'Edit message';
    var isView = messageDate < new Date() ? true : false;

    panel({
      noPadding: false,
      title: messageTitle,
      render: (onSubmit: any) => (
        <MessagePanel
          isView={isView}
          message={message}
          closeDialog={(messageCreated: boolean) => {
            onSubmit();
            if (messageCreated) {
              refetch();
            }
          }}
        />
      ),
    });
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const clearFilters = () => {
    setRoleFilter('');
    setStatusFilter('');
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  const onRoleFilterItemsChanges = (value: SearchDropDownOption<any>[]) => {
    setSelectedRoles(value.map((x) => x.value));
  };

  return (
    <div className="relative h-full rounded-xl bg-white p-8">
      <div className="flex flex-col">
        <div className="pb-5 sm:flex sm:items-center sm:justify-between">
          <div className="text-body w-8/12 sm:flex sm:justify-around">
            <div className="text-body w-8/12 flex-col sm:flex sm:justify-around">
              <div className="relative w-full">
                <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                  {searchValue === '' && (
                    <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                  )}
                </span>
                <input
                  className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                  placeholder="      Search by message text..."
                  onChange={search}
                />
              </div>
              {showFilter && (
                <div className="mt-4 flex flex-row items-center justify-between sm:mt-16">
                  <div className="mr-2 flex items-center gap-2">
                    <SearchDropDown<any>
                      displayMenuOverlay
                      className={'mr-1 ml-2'}
                      options={
                        roleData.map((x) => {
                          return {
                            id: x.id ?? '',
                            value: x,
                            label: x.name,
                            disabled: false,
                          };
                        }) || []
                      }
                      onChange={(value) => onRoleFilterItemsChanges(value)}
                      placeholder={'Role'}
                      pluralSelectionText={'Roles'}
                      color={'secondary'}
                      multiple
                      selectedOptions={selectedRoles.map((x) => {
                        return {
                          id: x.id ?? '',
                          value: x,
                          label: x.name,
                        };
                      })}
                      info={{
                        name: `Filter by: Role`,
                      }}
                    />
                  </div>
                  <div className="mr-2 flex items-center gap-2">
                    <Dropdown
                      fillType="filled"
                      textColor="white"
                      fillColor="secondary"
                      placeholder="Status"
                      labelColor="white"
                      selectedValue={statusFilter}
                      list={[
                        { label: 'Scheduled', value: 'scheduled' },
                        { label: 'Sent', value: 'sent' },
                      ]}
                      onChange={(item) => {
                        setStatusFilter(item);
                      }}
                      className="w-48"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-full">
                      <DatePicker
                        placeholderText={`Start date...`}
                        wrapperClassName="text-center w-full"
                        className="text-textMid bg-uiBg mx-auto"
                        selected={
                          startDateFilter
                            ? new Date(startDateFilter)
                            : undefined
                        }
                        onChange={(date: Date) => {
                          setStartDateFilter(date);
                        }}
                        dateFormat="EEE, dd MMM yyyy"
                      />
                    </span>
                    <span className="w-full">
                      <DatePicker
                        placeholderText={`End date...`}
                        wrapperClassName="text-center w-full"
                        className="text-textMid bg-uiBg mx-auto"
                        selected={
                          endDateFilter ? new Date(endDateFilter) : undefined
                        }
                        onChange={(date: Date) => {
                          setEndDateFilter(date);
                        }}
                        dateFormat="EEE, dd MMM yyyy"
                      />
                    </span>
                  </div>
                  <div className="w-full">
                    <button
                      onClick={clearFilters}
                      type="button"
                      className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white"
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

          <div className="mt-3 justify-end sm:mt-0 sm:ml-4">
            {hasPermission(PermissionEnum.create_static) && (
              <button
                onClick={() => displayMessagePanel()}
                type="button"
                className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
              >
                <MailIcon className="mr-4 h-5 w-5"></MailIcon> Send a new
                message
              </button>
            )}
          </div>
        </div>

        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <UiTable
                columns={[
                  { field: 'message', use: 'Message text' },
                  { field: 'roleNames', use: 'Send to (roles)' },
                  { field: 'status', use: 'Status' },
                  { field: 'messageDate', use: 'Scheduled date' },
                ]}
                rows={tableData}
                viewRow={displayEditViewMessagePanel}
                editRow={
                  hasPermission(PermissionEnum.update_system) &&
                  displayEditViewMessagePanel
                }
                component={'messaging'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
