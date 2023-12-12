import { useQuery } from '@apollo/client';
import {
  DocumentDto,
  PermissionEnum,
  usePanel,
  WorkflowStatusDto,
} from '@ecdlink/core';
import { GetAllWorkflowStatus, PersonalRecordsList } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../components/content-loader/content-loader';
import UiTable from '../../components/ui-table';
import { useUser } from '../../hooks/useUser';
import DocumentPanel from './components/document-panel/document-panel';
import { SearchIcon } from '@heroicons/react/solid';
import debounce from 'lodash.debounce';
import { Dropdown } from '@ecdlink/ui';
import DatePicker from 'react-datepicker';

export default function Documents() {
  const { hasPermission } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [types, setTypes] = useState([
    'MaternalCaseRecord',
    'RoadToHealthBook',
  ]);
  const [clientStatusValues, setClientStatusValues] = useState([
    'Active',
    'Inactive',
  ]);
  const [filterDateAdded, setFilterDateAdded] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const { data: workflowStatuses } = useQuery(GetAllWorkflowStatus, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: newData, refetch } = useQuery(PersonalRecordsList, {
    variables: {
      showOnlyTypes: types,
      order: [{ updatedDate: 'DESC' }],
      pagingInput: {
        filterBy: [
          {
            fieldName: 'insertedDate',
            filterType: 'LESS_THAN_OR_EQUAL',
            value: endDate || null,
          },
          {
            fieldName: 'insertedDate',
            filterType: 'GREATER_THAN_OR_EQUAL',
            value: startDate || null,
          },
        ],
      },
      search: searchValue,
      showOnlyStatus: clientStatusValues,
      // TODO: Use date filter and pagination:
      // {
      // filterBy: [
      //   {
      //     fieldName: "insertedDate",
      //     filterType: "LESS_THAN_OR_EQUAL",
      //     value: "2023-06-06T00:00:00.000+02:00"
      //   },
      // {
      //   fieldName: "insertedDate",
      //   filterType: "GREATER_THAN_OR_EQUAL",
      //   value: "2023-06-04T00:00:00.000+02:00"
      // }
      //   ]
      // }
    },
    fetchPolicy: 'cache-and-network',
  });

  const [tableData, setTableData] = useState<any[]>([]);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  useEffect(() => {
    if (newData && newData?.allClientRecords) {
      const copyItems = newData?.allClientRecords?.map((item: DocumentDto) => {
        return {
          ...item,
          fullName: item.user
            ? `${item.user?.firstName} ${item.user?.surname}`
            : 'System',
          type: item.documentType?.name,
          status: item.workflowStatus?.description,
          createdByName: item?.createdByName,
          clientName: item?.clientName,
          createdDate:
            item.insertedDate !== null
              ? new Date(item.insertedDate).toISOString()
              : '',
          _view: undefined,
          _edit: undefined,
          _url: undefined,
        };
      });
      setTableData(copyItems);
    }
  }, [newData]);

  const panel = usePanel();
  const displayPanel = (item: DocumentDto) => {
    const filteredStatuses = workflowStatuses.GetAllWorkflowStatus.filter(
      (x: WorkflowStatusDto) =>
        x.workflowStatusType.id === item.workflowStatus?.workflowStatusTypeId
    );
    panel({
      noPadding: true,
      title: 'View document',
      render: (onSubmit: any) => (
        <DocumentPanel
          item={item}
          workflowStatus={filteredStatuses}
          closeDialog={(result: boolean) => {
            if (result) {
              refetch();
            }

            onSubmit();
          }}
        />
      ),
    });
  };

  const clearFilters = () => {
    setTypes(['MaternalCaseRecord', 'RoadToHealthBook']);
    setClientStatusValues(['Active', 'Inactive']);
    setEndDate(null);
    setStartDate(null);
  };

  const displayDocument = (document: DocumentDto) => {
    window.open(document.reference, '_blank');
  };

  useEffect(() => {
    if (endDate) {
      setFilterDateAdded(!filterDateAdded);
    }
  }, [endDate]);

  if (tableData) {
    return (
      <div className="w-11/12 rounded-2xl bg-white p-8">
        <div className="relative mb-6 flex w-9/12 items-center rounded-2xl">
          <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
            {searchValue === '' && (
              <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
            )}
          </span>
          <input
            className="bg-adminPortalBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
            placeholder="      Search by email or name..."
            onChange={search}
          />
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
        {showFilter && (
          <div className="my-8 flex flex-row items-center justify-between sm:mt-16">
            <div className="mr-2 flex items-center gap-2">
              <Dropdown<string[]>
                fillType="filled"
                textColor="textMid"
                fillColor="adminPortalBg"
                placeholder="Document type"
                labelColor="textMid"
                selectedValue={types}
                list={[
                  { label: 'RoadToHealthBook', value: ['RoadToHealthBook'] },
                  {
                    label: 'MaternalCaseRecord',
                    value: ['MaternalCaseRecord'],
                  },
                ]}
                onChange={(item) => {
                  // setStatusFilter(item);
                  setTypes(item);
                }}
                className="w-52"
              />
            </div>
            {!filterDateAdded && (
              <div
                className="mr-2 flex items-center gap-2"
                onClick={() => setFilterDateAdded(!filterDateAdded)}
              >
                <Dropdown
                  fillType="filled"
                  textColor="textMid"
                  fillColor="adminPortalBg"
                  placeholder="Date added"
                  labelColor="textMid"
                  // selectedValue={statusFilter}
                  list={[]}
                  onChange={(item) => {
                    // setStatusFilter(item);
                    // getAllMessageLogsForAdmin();
                  }}
                  className="w-48"
                />
              </div>
            )}
            {filterDateAdded && (
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange={true}
                inline
                shouldCloseOnSelect={true}
              />
            )}
            <div className="mr-2 flex items-center gap-2">
              <Dropdown
                fillType="filled"
                textColor="textMid"
                fillColor="adminPortalBg"
                placeholder="Client status"
                labelColor="textMid"
                // selectedValue={statusFilter}
                list={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                onChange={(item) => {
                  setClientStatusValues([item]);
                  // getAllMessageLogsForAdmin();
                }}
                className="w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-full"></span>
              <span className="w-full"></span>
            </div>
            <div className="w-full">
              <button
                onClick={() => clearFilters()}
                type="button"
                className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={[
                    { field: 'clientName', use: 'Client' },
                    { field: 'createdByName', use: 'CHW' },
                    { field: 'type', use: 'type' },
                    { field: 'insertedDate', use: 'Date added' },
                    { field: 'clientStatus', use: 'Client status' },
                  ]}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_documents) &&
                    displayDocument
                  }
                  viewRow={
                    hasPermission(PermissionEnum.view_documents) && displayPanel
                  }
                  component={'cms'}
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
