import { classNames } from '@ecdlink/ui';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import Table from 'react-tailwind-table';
import Icon from '../icon';

export default function UiTable({
  columns = [],
  rows = [],
  options = {},
  urlRow,
  sendRow,
  editRow,
  deleteRow,
  viewRow,
}: UiTableProps) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [searchValue, setSearchValue] = useState('');
  const [searchRows, setSearchRows] = useState<any[]>([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const getSearchResults = () => {
    if (!searchValue) {
      return rows;
    }

    return fuse.current.search(searchValue).map((result) => result.item);
  };

  const makeColumns = (cols: any[] = []) => {
    cols.push({ field: '_action', use: ' ' });
    return [...columns, ...cols];
  };

  const makeRows = () => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return [{ [columns[0].field]: 'No entries found' }];
    }

    return ((searchRows as any[]) || []).map((row: any) => {
      let rowKey = 1;
      row._action = (
        <div className="flex justify-center">
          {viewRow && (
            <Icon
              key={`viewRow_${rowKey}`}
              icon="SearchIcon"
              color="transparent"
              height="20px"
              className="ml-2 cursor-pointer text-gray-400"
              onClick={() => viewRow(row)}
            />
          )}
          {editRow && (
            <Icon
              key={`editRow${rowKey}`}
              icon="PencilAltIcon"
              color="transparent"
              height="20px"
              className="ml-2 cursor-pointer text-gray-400"
              onClick={() => editRow(row)}
            />
          )}
          {urlRow && (
            <Icon
              key={`urlRow${rowKey}`}
              icon="PencilAltIcon"
              color="transparent"
              height="20px"
              className="ml-2 cursor-pointer text-gray-400"
              onClick={() => urlRow(row)}
            />
          )}
          {sendRow && (
            <Icon
              key={`sendRow${rowKey}`}
              icon="MailIcon"
              color="transparent"
              height="20px"
              className="ml-2 cursor-pointer text-gray-400"
              onClick={() => sendRow(row)}
            />
          )}
          {deleteRow && (
            <Icon
              key={`deleteRow${rowKey}`}
              icon="TrashIcon"
              className="ml-2 cursor-pointer text-gray-400"
              height="20px"
              color="transparent"
              onClick={() => deleteRow(row)}
            />
          )}
        </div>
      );
      ++rowKey;
      return row;
    });
  };

  const formatDate = (value) => {
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

  const renderFormat = (row, column, display_value) => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return column.field === columns[0].field ? display_value : <></>;
    }

    let rowValue;

    if (typeof display_value === 'boolean') {
      rowValue = (
        <div className="ml-5 flex">
          {display_value ? (
            <Icon
              icon="CheckCircleIcon"
              className="text-successMain ml-1"
              height="20px"
              color="transparent"
            />
          ) : (
            <Icon
              icon="XCircleIcon"
              className="text-errorMain ml-1"
              height="20px"
              color="transparent"
            />
          )}
        </div>
      );
    } else if (column.field.match(/created|createdAt|updated|updatedAt/)) {
      rowValue = (
        <span className="overflow-ellipsis">{formatDate(display_value)}</span>
      );
    } else if (column.type === 'array') {
      rowValue = (
        <div className="ml-4 flex flex-row flex-wrap items-center">
          {display_value &&
            display_value.map((item) => (
              <div
                key={item.id}
                className="bg-uiMid m-1 rounded-full py-1 px-3 text-xs text-white"
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
            'inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white',
            display_value && display_value[0].statusColor
          )}
        >
          {display_value && display_value[0].statusValue}
        </span>
      );
    } else {
      rowValue =
        typeof display_value === 'string' ? (
          <div className="inline-block overflow-ellipsis">{display_value}</div>
        ) : (
          display_value
        );
    }
    return rowValue;
  };

  return (
    <div className="table-top w-full overflow-hidden rounded-lg shadow-lg">
      <div className="relative bg-gray-50 p-2 px-4 text-gray-400 focus-within:text-gray-600">
        <input
          className="focus:outline-none focus:ring-offset-primary block w-full rounded-md border border-gray-200 bg-white py-2 pl-8 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 sm:text-sm"
          placeholder="Search..."
          onChange={search}
        />
        <span className="input-group-text absolute inset-y-1/2 left-6 flex items-center whitespace-nowrap rounded text-center text-base font-normal text-gray-600">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="search"
            className="w-4"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
            ></path>
          </svg>
        </span>
      </div>
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
            table_row: `text-gray-900 border-b-2 border-gray-100 bg-blue-50`,
            table_data: `px-6 py-3 pl-6 pr-6 pt-3 pb-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider leading-none`,
          },
          table_body: {
            main: ``,
            table_row: 'border-none  ',
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
        hovered={false}
      />
    </div>
  );
}
