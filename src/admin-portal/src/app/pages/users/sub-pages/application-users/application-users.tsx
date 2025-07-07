import { useQuery } from '@apollo/client';
import { UserDto } from '@ecdlink/core';
import debounce from 'lodash.debounce';
import { UserList } from '@ecdlink/graphql';
import { SearchDropDownOption, Table } from '@ecdlink/ui';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Status } from '../application-admins/applications-admins.types';
import { format } from 'date-fns';

import { filterByValue } from '../../../../utils/string-utils/string-utils';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import { columnColor } from '../../../../utils/app-usage/app-usage-utils';
import { ColumnNames, UserSearch } from './application-user.types';

export const sortByClientStatusOptions: SearchDropDownOption<string>[] = [
  Status?.ACTIVE,
  Status?.INACTIVE,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function ApplicationUsers() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const tableRef = useRef<TableRefMethods>(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleSetDateFilter = useCallback(() => {
    setFilterDateAdded(!filterDateAdded);
  }, [filterDateAdded]);

  useEffect(() => {
    if (endDate) {
      handleSetDateFilter();
    }
  }, [endDate, handleSetDateFilter]);

  const [statusFilter, setStatusFilter] = useState<
    SearchDropDownOption<string>[]
  >([sortByClientStatusOptions[0]]);

  const queryVariables = useMemo(
    () => ({
      search: '',
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    }),
    []
  );

  const { data, loading } = useQuery(UserList, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  const isLoading = loading;
  const isFilterActive = !!startDate || !!endDate || !!statusFilter?.length;

  const noContentText = useMemo(() => {
    if (isFilterActive) {
      return 'No results found. Try changing the filters selected';
    }

    return 'No entries found';
  }, [isFilterActive]);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const mapUserTableItem = (item: any) => {
    return {
      ...item,
      displayColumnIdPassportEmail:
        item?.user?.userName ?? item?.idNumber ?? item?.email ?? '',
      userId: item.id,
      fullName: `${item.fullName}`,
      isActive: item.isActive,
      idNumber: item.idNumber,
      dateInvited: item.insertedDate,
      connectUsage: item?.connectUsage,
    };
  };

  useEffect(() => {
    if (data && data.users) {
      const copyItems = data.users.map((item: UserDto) =>
        mapUserTableItem(item)
      );
      const filteredByDateData = copyItems?.filter((d) => {
        return (
          new Date(d?.insertedDate).getTime() >=
            new Date(startDate)?.getTime() &&
          new Date(d?.insertedDate).getTime() <= new Date(endDate)?.getTime()
        );
      });

      if (startDate && endDate) {
        if (statusFilter?.length === 1) {
          if (statusFilter.some((e) => e.value === Status?.ACTIVE)) {
            const filterByStatusActive = filteredByDateData?.filter(
              (item) => item?.isActive
            );
            setTableData(filterByStatusActive);
            return;
          } else {
            const filterByStatusInactive = filteredByDateData?.filter(
              (item) => !item?.isActive
            );
            setTableData(filterByStatusInactive);
            return;
          }
        }
        setTableData(filteredByDateData);
        return;
      }

      if (statusFilter) {
        if (statusFilter?.length === 1) {
          if (statusFilter.some((e) => e.value === Status?.ACTIVE)) {
            const filterByStatusActive = copyItems?.filter(
              (item) => item?.isActive
            );
            setTableData(filterByStatusActive);
            return;
          } else {
            const filterByStatusInactive = copyItems?.filter(
              (item) => !item?.isActive
            );
            setTableData(filterByStatusInactive);
            return;
          }
        }
      }
      setTableData(copyItems);
    }
  }, [data, endDate, startDate, statusFilter]);

  const clearFilters = () => {
    setStatusFilter([]);
    setStartDate('');
    setEndDate('');
  };

  const columns: Icolumn[] = [
    {
      field: 'displayColumnIdPassportEmail',
      use: ColumnNames.IdPassportEmail,
    },
    {
      field: 'fullName',
      use: ColumnNames.Name,
    },
    {
      field: 'roleComponent',
      use: ColumnNames.Role,
    },
    {
      field: 'insertedDateFormatted',
      use: ColumnNames.Date,
    },
    {
      field: 'isActiveComponent',
      use: ColumnNames.Status,
    },
  ];

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: item?.id,
        displayColumnIdPassportEmail:
          item?.userName ?? item?.idNumber ?? item?.email ?? '-',
        connectUsageComponent: item?.connectUsage
          ? columnColor(item.connectUsage)
          : '-',
        insertedDateFormatted: item?.insertedDate
          ? format(new Date(item?.insertedDate), 'dd/MM/yyyy')
          : '-',
        isActiveComponent: (
          <p className={item?.isActive ? 'text-successMain' : 'text-errorMain'}>
            {item?.isActive ? 'Active' : 'Inactive'}
          </p>
        ),
        roleComponent: (
          <div className="ml-0 flex cursor-pointer items-center">
            {item?.roles?.map((item: any) => {
              const chipColor = (role?: string) => {
                switch (role) {
                  case 'Administrator':
                    return 'bg-secondary';
                  case 'Practitioner':
                    return 'bg-infoMain';
                  case 'Principal':
                    return 'bg-tertiary';
                  default:
                    return 'bg-primary';
                }
              };
              return (
                <div
                  key={`role_` + item?.id}
                  className={
                    `${chipColor(item?.tenantName)}` +
                    ' m-1 rounded-full p-3 py-1 text-xs text-white'
                  }
                >
                  {item?.tenantName}
                </div>
              );
            })}
          </div>
        ),
      })
    ) ?? [];

  return (
    <>
      <div className="bg-adminPortalBg h-full rounded-2xl p-4 ">
        <div className="rounded-xl bg-white p-12">
          <Table
            watchMode
            ref={tableRef}
            rows={rows}
            columns={columns}
            onClearFilters={clearFilters}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || isLoading,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            search={{
              placeholder: UserSearch.SearchBy,
              onChange: search,
            }}
            filters={[
              {
                dateFormat: 'd MMM yyyy',
                className: 'w-64 h-11 mt-1 border-2 border-transparent',
                isFullWidth: false,
                colour: !!startDate ? 'secondary' : 'adminPortalBg',
                textColour: !!startDate ? 'white' : 'textMid',
                placeholderText: ColumnNames.Date,
                type: 'date-picker',
                showChevronIcon: true,
                chevronIconColour: !!startDate ? 'white' : 'primary',
                hideCalendarIcon: true,
                selected: startDate,
                onChange,
                startDate,
                endDate,
                selectsRange: true,
                shouldCloseOnSelect: true,
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'w-11/12 mx-8 mt-1',
                options: sortByClientStatusOptions,
                selectedOptions: statusFilter,
                onChange: setStatusFilter,
                placeholder: 'Status',
                multiple: true,
                info: { name: 'Status:' },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
