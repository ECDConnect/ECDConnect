import { useEffect, useState } from 'react';
import { LocalStorageKeys, AuthUser, MessageLogDto } from '@ecdlink/core';
import { MailIcon, SearchIcon } from '@heroicons/react/solid';
import debounce from 'lodash.debounce';
import { format, subDays } from 'date-fns';

import { GetAllMessageLogsForAdmin } from '@ecdlink/graphql';
import { useLazyQuery } from '@apollo/client';
import { SearchDropDown, SearchDropDownOption, Dropdown } from '@ecdlink/ui';
import CustomDateRangePicker from '../../../components/date-picker';
import NavigationTable from '../../../components/navigation-table';
import { useHistory } from 'react-router';
import { MessageRoleDto, ssRoles } from './message';
import { useTenant } from '../../../hooks/useTenant';
import * as styles from '../../pages.styles';

export default function MessageList() {
  const history = useHistory();

  const [tableData, setTableData] = useState<any[]>([]);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser>();
  const [searchValue, setSearchValue] = useState('');
  const [roleData] = useState<MessageRoleDto[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<MessageRoleDto[]>(ssRoles);
  const user = localStorage.getItem(LocalStorageKeys.user);
  const [selectedPageSize] = useState<number>(null);
  const tenant = useTenant();

  const currentDate = new Date();
  const startDate = subDays(currentDate, 30);
  const endDate = currentDate;
  const now = new Date();

  const [selectedRange, setSelectedRange] = useState<Date[]>([
    startDate,
    endDate,
  ]);

  useEffect(() => {
    if (user) {
      setAuthenticatedUser(JSON.parse(user));
    }
  }, [user]);

  const [getAllMessageLogsForAdmin, { data: messages }] = useLazyQuery(
    GetAllMessageLogsForAdmin,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        userId: authenticatedUser?.id,
        roleIds: selectedRoles.map(({ id }) => id),
        status: statusFilter,
        startDate: showFilter ? selectedRange[0] : null,
        endDate: showFilter ? selectedRange[1] : null,
      },
    }
  );

  useEffect(() => {
    if (!messages) {
      getAllMessageLogsForAdmin();
    }
  }, [messages, getAllMessageLogsForAdmin]);

  const getMessageFormattedDateString = (
    messageDate: string | null | undefined
  ): string => {
    if (!messageDate) return '';
    const date = new Date(messageDate);
    return format(date, 'yyyy-MM-dd HH:mm');
  };

  const getMessageStatus = (messageDate: string | null | undefined): string => {
    if (!messageDate) return '';
    const date = new Date(messageDate);
    return date > now ? 'Scheduled' : 'Sent';
  };

  useEffect(() => {
    if (messages) {
      const copyItems = messages.allMessageLogsForAdmin.map(
        (item: MessageLogDto, index: number) => {
          return {
            ...item,
            message: item.message,
            subject: item.subject,
            messageDate: getMessageFormattedDateString(
              item.messageDate as any as string
            ),
            status: getMessageStatus(item.messageDate as any as string),
            id: index.toString(),
          };
        }
      );
      setTableData(copyItems);
    }
  }, [tenant, messages]);

  const displayMessagePanel = (message: MessageLogDto) => {
    localStorage.setItem('selectedMessage', JSON.stringify(message));

    history.push({
      pathname: '/messaging/view-message',
      state: {
        component: 'messaging',
      },
    });
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 350);

  const clearFilters = () => {
    setSelectedRoles([]);
    setStatusFilter('');
    setSelectedRange([startDate, endDate]);
    getAllMessageLogsForAdmin();
  };

  const onRoleFilterItemsChanges = (value: SearchDropDownOption<any>[]) => {
    setSelectedRoles(value.map((x) => x.value));
    getAllMessageLogsForAdmin();
  };

  const handleDateChange = (range: Date[]) => {
    setSelectedRange(range);
    getAllMessageLogsForAdmin();
  };

  return (
    <div className="bg-white">
      <div className="m-5 flex flex-col">
        <div className="m-5 pb-5 sm:flex sm:items-center sm:justify-between">
          <div className="text-body w-full sm:flex  ">
            <div className="text-body w-full flex-col sm:flex sm:justify-around">
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
            </div>
          </div>

          <div className="mt-0  flex w-10/12 flex-row sm:mt-0  sm:ml-4">
            <div className="pr-2 ">
              <span className=" text-lg font-medium leading-6 text-gray-900">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  id="dropdownHoverButton"
                  className={styles.filterButton}
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

            <div className="flex w-full flex-row ">
              <button
                onClick={() => displayMessagePanel(null)}
                type="button"
                className={styles.mainButton}
              >
                <MailIcon className="mr-4 h-5 w-5"></MailIcon> Send a new
                message
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="mb-3 flex w-full flex-row flex-wrap items-center">
            <div className="relative inline-block pr-2 text-left">
              <SearchDropDown<any>
                menuItemClassName="w-11/12 left-4"
                className="mb-2 h-11 border-2 border-transparent"
                color="quatenary"
                bgColor="white"
                options={
                  roleData.map((x) => {
                    return {
                      id: x.id ?? '',
                      value: x,
                      label: x.label,
                      disabled: false,
                    };
                  }) || []
                }
                onChange={(value) => onRoleFilterItemsChanges(value)}
                placeholder={'Role'}
                pluralSelectionText={'Roles'}
                multiple
                selectedOptions={selectedRoles.map((x) => {
                  return {
                    id: x.id ?? '',
                    value: x,
                    label: x.label,
                  };
                })}
                info={{
                  name: `Filter by: Role`,
                }}
              />
            </div>
            <div className="relative inline-block pr-2 text-left">
              <SearchDropDown<string>
                // displayMenuOverlay
                menuItemClassName="w-11/12 left-4"
                className="mb-2 h-11 border-2 border-transparent"
                color="quatenary"
                bgColor="white"
                options={[
                  { id: '1', label: 'Scheduled', value: 'scheduled' },
                  { id: '2', label: 'Sent', value: 'sent' },
                ]}
                onChange={(item) => {
                  setStatusFilter(item[0].value);
                  getAllMessageLogsForAdmin();
                }}
                placeholder={'Status'}
                pluralSelectionText={'Status'}
                info={{
                  name: `Filter by: Status`,
                }}
              />
            </div>
            <div>
              <CustomDateRangePicker
                handleDateChange={handleDateChange}
                selectedRange={selectedRange}
              />
            </div>

            <div className="flex-end flex p-4">
              <button
                onClick={clearFilters}
                type="button"
                className={styles.clearButton}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        <div className="-my-2 mb-5 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <NavigationTable
                columns={[
                  { field: 'subject', use: 'Message title' },
                  { field: 'message', use: 'Message text' },
                  {
                    field: 'roleNames',
                    use: 'Send to (roles)',
                    type: 'roleNames',
                  },
                  { field: 'status', use: 'Status', type: 'messageStatus' },
                  { field: 'messageDate', use: 'Scheduled date' },
                ]}
                showSearch={false}
                showSelect={false}
                rows={tableData}
                viewRow={displayMessagePanel}
                searchInput={searchValue}
                options={{
                  per_page: selectedPageSize,
                  rows: tableData?.length,
                }}
                component={'messaging'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
