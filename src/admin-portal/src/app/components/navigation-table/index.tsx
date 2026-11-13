import Fuse from 'fuse.js';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Table from 'react-tailwind-table';

// A leading checkbox column is always the first column - squeeze that first
// header/body cell down to just wide enough for the checkbox.
const SELECT_COLUMN_CLASSES =
  '[&_thead_th:first-child]:w-px [&_thead_th:first-child]:pl-4 [&_thead_th:first-child]:pr-2 ' +
  '[&_tbody_td:first-child]:w-px [&_tbody_td:first-child]:pl-4 [&_tbody_td:first-child]:pr-2';

export default function NavigationTable({
  columns = [],
  rows = [],
  options = {},
  urlRow,
  searchInput,
  component,
  viewRow,
  showSearch,
  showSelect,
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
    if (!showSearch) setSearchValue(searchInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, searchInput]);

  const getSearchResults = () => {
    if (!searchValue) {
      return rows;
    }
    return fuse.current.search(searchValue).map((result) => result.item);
  };

  const makeColumns = (cols: any[] = []) => {
    if (showSelect) {
      const selectColumn = {
        field: 'select',
        use: selectAllCheckbox,
        Header: 'Select',
        accessor: '', // Set the accessor value based on your data structure
        Cell: null,
      };
      const columnsWithSelect = [selectColumn, ...cols];
      return [...columnsWithSelect, ...columns];
    }
    cols.push({ field: '_action', use: ' ' });
    return [...columns, ...cols];
  };

  const handleRowSelect = (
    event: ChangeEvent<HTMLInputElement>,
    row: { id: any }
  ) => {
    const selectedRowId = row.id;
    const isChecked = event.target.checked;
    setSelectedRows((prevSelectedRows) => {
      if (isChecked) {
        return [...prevSelectedRows, selectedRowId];
      } else {
        return prevSelectedRows.filter(
          (selectedRow) => selectedRow !== selectedRowId
        );
      }
    });
  };

  const selectableRows: any[] = searchRows ?? [];
  const allRowsSelected =
    selectableRows.length > 0 && selectedRows.length === selectableRows.length;

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(
      event.target.checked ? selectableRows.map((row) => row.id) : []
    );
  };

  const selectAllCheckbox = (
    <input
      type="checkbox"
      aria-label="Select all rows"
      className="form-checkbox text-primary border-gray-30 focus:border-secondary h-5 w-5 rounded focus:outline"
      checked={allRowsSelected}
      ref={(el) => {
        if (el) {
          el.indeterminate = selectedRows.length > 0 && !allRowsSelected;
        }
      }}
      onChange={handleSelectAll}
    />
  );

  const makeRows = () => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return [{ [columns[0]?.field]: 'No entries found' }];
    }

    return ((searchRows as any[]) || []).map((row: any) => {
      // if (showSelect) {
      //   let rowKey = 1;
      //   const rowWithCheckbox = {
      //     ...row,
      //   };

      //   ++rowKey;
      // }

      return row;
    });
  };

  const formatDate = (value: string | number | Date) => {
    try {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}/${month}/${year}`;
    } catch (e) {
      return '';
    }
  };

  const renderFormat = (row: any, column: any, display_value: any) => {
    if ((!searchRows?.length && searchValue) || !rows.length) {
      return column.field === columns[0].field ? display_value : <></>;
    }
    let rowValue: any;
    const checkboxCell = (
      <input
        type="checkbox"
        className="form-checkbox text-primary border-gray-30 focus:border-secondary h-5 w-5 rounded focus:outline "
        checked={selectedRows.includes(row.id)}
        onChange={(event) => handleRowSelect(event, row)}
      />
    );
    if (column.field === 'select') {
      return showSelect ? checkboxCell : '';
    } else if (typeof display_value === 'boolean') {
      rowValue = (
        <div className="ml-1 flex cursor-pointer">
          {display_value ? (
            <p className="text-successMain ">Active</p>
          ) : (
            <p className="text-errorMain text-normal">Inactive</p>
          )}
        </div>
      );
    } else if (
      column.field.match(/created|createdAt|updated|insertedDate|updatedAt/) &&
      column.field !== 'createdByName'
    ) {
      rowValue = (
        <span
          className="cursor-pointer overflow-ellipsis"
          onClick={() => {
            viewRow(row);
          }}
        >
          {formatDate(display_value)}
        </span>
      );
    } else if (column.type === 'messageStatus') {
      rowValue =
        display_value === 'Scheduled' ? (
          <div className="text-infoDark text-sm font-bold font-medium">
            {display_value}
          </div>
        ) : (
          <div className="text-successMain text-sm font-bold font-medium">
            {display_value}
          </div>
        );
    } else if (column.type === 'roleNames') {
      if (display_value) {
        const roleNames = display_value.split(', ');
        const getColor = (value) => {
          switch (value) {
            case 'Practitioner':
              return 'bg-tertiary';
            case 'Principal':
              return 'bg-quatenary';
            case 'Coach':
              return 'bg-quinary';
            default:
              return '';
          }
        };
        rowValue = roleNames.map((item: string) => (
          <div className="ml-1 flex" key={item}>
            <div
              className={
                `flex ` +
                getColor(item) +
                ` mt-1 inline-block overflow-ellipsis rounded-full px-2 py-1 font-bold text-white`
              }
            >
              <span>{item}</span>
            </div>
          </div>
        ));
      }
    } else {
      rowValue =
        typeof display_value === 'string' ? (
          <div className="inline-block overflow-ellipsis ">
            <span>{display_value}</span>
          </div>
        ) : (
          <div>{display_value}</div>
        );
    }

    return (
      <div
        onClick={() => {
          viewRow(row);
        }}
        className={'cursor-pointer'}
      >
        {rowValue}{' '}
      </div>
    );
  };

  return (
    <div className="table-top w-full overflow-hidden rounded-lg shadow-lg">
      {showSelect && selectedRows?.length >= 1 && (
        <div className="bg-infoMain flex w-full flex-row items-center justify-between py-2">
          <div className="w-4/12">
            <p className="text-md pl-4 text-white">
              {selectedRows?.length} Selected
            </p>
          </div>
        </div>
      )}

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
          main: showSelect ? SELECT_COLUMN_CLASSES : '',
          table_head: {
            table_row: `md:w-auto md:flex-row border-b-2 border-quatenary bg-adminPortalBg`,
            table_data: `truncate px-6 py-4 text-left text-sm font-semibold normal-case tracking-normal text-textMid leading-none`,
          },
          table_body: {
            main: ``,
            table_row:
              'border-none bg-white transition-colors hover:bg-adminPortalBg',
            table_data:
              'truncate px-6 py-1 text-sm font-medium text-textMid border-b border-uiLight align-middle',
          },
          footer: options.footer || {
            main: `mt-6 mx-5 table-footer`,
            statistics: {
              main: `text-textMid table-stats md:w-auto md:flex-row`,
              bold_numbers: `text-textDark font-bold`,
            },
            page_numbers: ` text-quatenary page-numbers z-10 relative inline-flex items-center px-4 py-2 text-sm font-medium w-4`,
          },
        }}
        columns={makeColumns()}
        rows={makeRows()}
        per_page={options.per_page || 10}
        no_content_text="-"
        striped={false}
      />
    </div>
  );
}
