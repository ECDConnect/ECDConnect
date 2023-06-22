import { classNames } from '@ecdlink/ui';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';
import Table from 'react-tailwind-table';
import Icon from '../icon';
import { Link, useHistory } from 'react-router-dom';

export default function UiTable({
  columns = [],
  rows = [],
  options = {},
  urlRow,
  searchInput,
  component,
}: UiTableProps) {
  const history = useHistory();

  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [searchValue, setSearchValue] = useState('');
  const [searchRows, setSearchRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const searchKeys = useRef(columns.map(({ field }) => field));
  const fuseOptions = {
    keys: searchKeys.current,
    shouldSort: false,
    threshold: 0,
    distance: 0,
  };
  const fuse = useRef(new Fuse(rows, fuseOptions));

  useEffect(() => {
    fuse.current = new Fuse(rows, fuseOptions);
    setSearchRows(getSearchResults());
    setLastUpdate(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    setSearchRows(getSearchResults());
    setLastUpdate(Date.now());
    setSearchValue(searchInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const getSearchResults = () => {
    if (!searchValue) {
      return rows;
    }

    return fuse.current.search(searchValue).map((result) => result.item);
  };

  const makeColumns = (cols: any[] = []) => {
    const selectColumn = {
      field: 'select',
      use: '',
      Header: 'Select',
      accessor: '', // Set the accessor value based on your data structure
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
        />
      ),
    };

    const columnsWithSelect = [selectColumn, ...cols];

    return [...columnsWithSelect, ...columns];
  };

  const handleRowSelect = (row: any) => {
    console.log(row);
    const isSelected = selectedRows.includes(row);
    let updatedSelectedRows = [];

    if (isSelected) {
      updatedSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow !== row
      );
    } else {
      updatedSelectedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedSelectedRows);
  };

  const makeRows = () => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return [{ [columns[0].field]: 'No entries found' }];
    }

    const handleRowSelect = (row: any) => {
      if (selectedRows.includes(row)) {
        setSelectedRows(
          selectedRows.filter((selectedRow) => selectedRow !== row)
        );
      } else {
        setSelectedRows([...selectedRows, row]);
      }
    };

    return ((searchRows as any[]) || []).map((row: any) => {
      let rowKey = 1;

      const checkboxCell = (
        <input
          type="checkbox"
          className="form-checkbox text-primary border-gray-30 h-5 w-5 rounded focus:bg-blue-600 focus:ring-2 "
          onChange={() => handleRowSelect(row)}
          checked={selectedRows.includes(row)}
        />
      );

      const rowWithCheckbox = {
        select: checkboxCell,
        ...row,
      };

      ++rowKey;
      return rowWithCheckbox;
    });
  };

  const formatDate = (value: string | number | Date) => {
    try {
      // date stored in UTC add 2 hours
      const date = new Date(value);
      date.setHours(date.getHours() + 2);
      return new Date(value)
        .toString()
        .replace(' GMT+0200 (South Africa Standard Time)', '');
    } catch (e) {
      return 'N/A';
    }
  };
  const viewSelectedRow = (selectedRow: any) => {
    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );
    console.log(component);
    history.push({
      pathname: urlRow,
      state: component,
    });
  };

  const renderFormat = (row: any, column: any, display_value: any) => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return column.field === columns[0].field ? display_value : <></>;
    }

    let rowValue: any;

    if (typeof display_value === 'boolean') {
      rowValue = (
        <div className="ml-1 flex cursor-pointer">
          {display_value ? (
            // <Icon
            //   icon="CheckCircleIcon"
            //   className="text-successMain ml-1"
            //   height="20px"
            //   color="transparent"
            // />

            <p className="text-successMain ">Active</p>
          ) : (
            // <Icon
            //   icon="XCircleIcon"
            //   className="text-errorMain ml-1"
            //   height="20px"
            //   color="transparent"
            // />
            <p className="text-errorMain text-normal">Inactive</p>
          )}
        </div>
      );
    } else if (
      column.field.match(/created|createdAt|updated|InsertedDate|updatedAt/)
    ) {
      rowValue = (
        <span className="cursor-pointer overflow-ellipsis">
          {formatDate(display_value)}
        </span>
      );
    } else if (column.type === 'array') {
      rowValue = (
        <div className="ml-0 flex cursor-pointer flex-row flex-wrap items-center">
          {display_value &&
            display_value.map((item) => (
              <div
                key={item.id}
                className={
                  `${
                    item[column.displayProperty] === 'Administrator'
                      ? 'bg-tertiary'
                      : 'bg-primary'
                  }` + ' m-1 rounded-full py-1 px-3 text-xs text-white'
                }
              >
                {item[column.displayProperty]}
              </div>
            ))}
        </div>
      );
    } else if (column.type === 'workflowStatus') {
      rowValue = (
        <span
          className={classNames(
            'inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white ',
            display_value && display_value[0].statusColor
          )}
        >
          {display_value && display_value[0].statusValue}
        </span>
      );
    } else {
      rowValue =
        typeof display_value === 'string' ? (
          <div className="inline-block overflow-ellipsis ">
            <span>{display_value}</span>
          </div>
        ) : (
          display_value
        );
    }
    return (
      <div className="cursor-pointer" onClick={() => viewSelectedRow(row)}>
        {rowValue}{' '}
      </div>
    );
  };

  return (
    <div className="table-top w-full overflow-hidden rounded-lg shadow-lg">
      <Table
        key={`table-${lastUpdate}`}
        row_render={renderFormat}
        should_export={options.should_export || false}
        show_search={options.show_search || false}
        styling={{
          base_bg_color: 'white',
          base_text_color: 'text-gray-900',
          top: options.top || {
            elements: {
              main: 'hidden',
            },
          },
          main: 'rounded-lg',
          table_head: {
            table_row: ` mb-10 border-b-2 border-secondary `,
            table_data: `px-6 py-8 pl-6 pr-6 pt-4 pb-4 bg-infoBb text-left text-xs font-medium text-gray-500 uppercase tracking-wider leading-none bg-D2F1F9`,
          },
          table_body: {
            main: ``,
            // table_row: 'border-none bg-secondary ',
            table_row: 'border-none py-8 bg-infoBb',

            table_data:
              'truncate w-24 px-6 pt-3 pb-3 text-sm font-medium text-gray-900 border-b border-gray-100',
          },
          footer: options.footer || {
            main: `${rows.length < 10 ? 'hidden' : ''} mt-8 mx-5 table-footer`,
            statistics: {
              main: `${
                rows.length < 10 ? 'hidden' : ''
              } text-gray-600 table-stats md:w-auto md:flex-row`,
              bold_numbers: `text-gray-900 font-bold`,
            },
            page_numbers: `page-numbers z-10 text-primary relative inline-flex items-center px-4 py-2 text-sm font-medium w-4`,
          },
        }}
        columns={makeColumns()}
        rows={makeRows()}
        per_page={options.per_page || 10}
        no_content_text="-"
        striped
        bordered
      />
    </div>
  );
}
