import { classNames } from '@ecdlink/ui';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';
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
  searchInput,
}: UiTableProps) {
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
          className="form-checkbox text-primary h-5 w-5 rounded border-gray-30 focus:ring-2 focus:bg-blue-600"
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
    } else if (column.type === 'arrayString') {
      rowValue = (
        <div className="ml-4 flex flex-row flex-wrap items-center">
          {display_value &&
            display_value.map((item) => (
              <div
                key={item}
                className="bg-uiMid m-1 rounded-full py-1 px-3 text-xs text-white"
              >
                {item}
              </div>
            ))}
        </div>
      );
    } else {
      rowValue = display_value;
    }

    return (
      <div className="flex flex-row items-center">
        {column.icon && (
          <Icon
            className="mr-1"
            height="20px"
            color="transparent"
            icon={column.icon}
          />
        )}
        {rowValue}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {makeColumns().map((column) => (
              <th
                key={column.Header}
                scope="col"
                className={classNames(
                  'py-2 px-4 text-left text-xs font-semibold text-gray-600',
                  column.className
                )}
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {makeRows().map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={classNames(
                    'py-2 px-4 text-sm text-gray-700',
                    columns[cellIndex].className
                  )}
                >
                  {renderFormat(row, columns[cellIndex], cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
