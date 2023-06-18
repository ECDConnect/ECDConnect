import { classNames } from '@ecdlink/ui';
import Fuse from 'fuse.js';
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
  }, [rows]);

  useEffect(() => {
    setSearchRows(getSearchResults());
    setLastUpdate(Date.now());
    setSearchValue(searchInput);
  }, [searchInput]);

  const getSearchResults = () => {
    if (!searchValue) {
      return rows;
    }

    return fuse.current.search(searchValue).map((result) => result.item);
  };

  const handleRowSelect = (row: any) => {
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

  const makeRows = () => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return [{ [columns[0].field]: 'No entries found' }];
    }

    return searchRows.map((row: any, index: number) => {
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

      const rowClassName = selectedRows.includes(row) ? 'bg-red-500 text-white' : '';

      const actionsCell = (
        <div className={`flex justify-start ${rowClassName}`}>
          {viewRow && (
            <Icon
              key={`viewRow_${index}`}
              icon="SearchIcon"
              color="transparent"
              height="20px"
              className="ml-1"
              onClick={() => viewRow(row)}
            />
          )}
          {editRow && (
            <Icon
              key={`editRow_${index}`}
              icon="PencilAltIcon"
              color="transparent"
              height="20px"
              className="ml-1"
              onClick={() => editRow(row)}
            />
          )}
          {deleteRow && (
            <Icon
              key={`deleteRow_${index}`}
              icon="TrashIcon"
              color="transparent"
              height="20px"
              className="ml-1"
              onClick={() => deleteRow(row)}
            />
          )}
        </div>
      );

      const rowWithActions = {
        ...rowWithCheckbox,
        actions: actionsCell,
      };

      return rowWithActions;
    });
  };

  const renderTable = () => {
    const tableClasses = classNames(
      'table-footer',
      'table-stats',
      'md:w-auto',
      'md:flex-row',
      'text-gray-600'
    );

    const pageNumbersClasses = classNames(
      'table-data',
      'bg-gray-50',
      'text-gray-500',
      'hovered'
    );

    return (
      <Table
        columns={makeColumns()}
        rows={makeRows()}
        options={options}
        classes={{ table: tableClasses, pageNumbers: pageNumbersClasses }}
        onRowClick={urlRow}
        onSendRow={sendRow}
      />
    );
  };

  return (
    <div className="mt-8 mx-5">
      {renderTable()}
      <div>Last Updated: {lastUpdate}</div>
    </div>
  );
}
