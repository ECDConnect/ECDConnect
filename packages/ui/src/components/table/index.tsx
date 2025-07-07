import ReactTailwindTable, { Icolumn, Irow } from 'react-tailwind-table';
import { TableProps, TableRefMethods } from './types';
import { getStyles } from './styles';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Checkbox, FormInput } from '../form-fields';
import Button from '../button/button';
import { classNames, renderIcon } from '../../utils';
import SearchDropDown, {
  SearchDropDownProps,
} from '../dropdown/search-dropdown/search-dropdown';
import { DatePicker, DatePickerProps } from '../date-picker';
import { ButtonProps } from '../button/button.types';
import LoadingSpinner from '../loading-spinner/loading-spinner';

export const Table = forwardRef<TableRefMethods, TableProps>(
  (
    {
      selectedRows: initialSelectedRows,
      multiSelect,
      rows,
      columns,
      rowsPerPage = 10,
      search,
      actionButton,
      bulkActions,
      filters,
      onClearFilters,
      onClickRow,
      onChangePage,
      loading,
      noContentText = '-',
      onChangeSelectedRows,
      watchMode,
      styling,
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [selectedRows, setSelectedRows] = useState<Irow[]>([]);
    const [openFilters, setOpenFilters] = useState<boolean>(false);

    const tableRef = useRef<ReactTailwindTable>(null);

    useImperativeHandle(ref, () => ({
      resetSelectedRows() {
        setSelectedRows([]);
        onChangeSelectedRows?.([]);
      },
    }));

    const totalPages = Math.ceil(rows?.length / rowsPerPage);

    const selectedFilters = filters?.filter((filter) => {
      if (filter?.type === 'date-picker') {
        return filter?.value || filter?.startDate;
      }
      return (filter as SearchDropDownProps<string>)?.selectedOptions?.length;
    });

    const rowsWithKey = rows?.map((row, index) => ({
      ...row,
      key: row?.key ?? index,
      checked: false,
    }));

    const handleRowSelect = (row: Irow) => {
      const rowIndex = selectedRows.findIndex(
        (selectedRow) => selectedRow.key === row.key
      );

      if (rowIndex > -1) {
        const updatedRows = selectedRows?.filter(
          (_, index) => index !== rowIndex
        );

        setSelectedRows(updatedRows);
        onChangeSelectedRows?.(updatedRows);
      } else {
        const updatedRows = [...selectedRows, row];
        setSelectedRows(updatedRows);
        onChangeSelectedRows?.(updatedRows);
      }
    };

    const handleColumnSelect = () => {
      if (selectedRows.length) {
        onChangeSelectedRows?.([]);
        return setSelectedRows([]);
      }

      onChangeSelectedRows?.(rowsWithKey);
      return setSelectedRows(rowsWithKey);
    };

    const customRowElements = (
      row: Irow,
      column: Icolumn,
      displayValue: string
    ) => {
      if (column.field === 'select') {
        return displayValue;
      }

      if (!!onClickRow) {
        return (
          <button
            className="w-full truncate text-left"
            onClick={() => onClickRow(row)}
          >
            {displayValue}
          </button>
        );
      }

      return <div>{displayValue}</div>;
    };

    const mergedColumns =
      bulkActions?.length || multiSelect
        ? ([
            {
              field: 'select',
              use: (
                <Checkbox
                  checkboxColor="textLight"
                  indeterminate={
                    selectedRows?.length > 0 &&
                    selectedRows.length < rows.length
                  }
                  checked={selectedRows?.length === rows?.length}
                  onCheckboxChange={handleColumnSelect}
                />
              ),
            },
            ...columns,
          ] as Icolumn[])
        : columns;

    const mergedRows =
      bulkActions?.length || multiSelect
        ? rowsWithKey?.map((row) => {
            const checked = selectedRows?.some(
              (selectedRow) => selectedRow.key === row.key
            );

            return {
              ...row,
              checked,
              select: (
                <Checkbox
                  checkboxColor="textLight"
                  checked={checked}
                  onCheckboxChange={() => handleRowSelect(row)}
                />
              ),
            };
          })
        : rowsWithKey;

    const tableKey = watchMode
      ? rows?.map((row) => `${row.key}_${row.checked}`).join('-')
      : undefined;

    useEffect(() => {
      if (initialSelectedRows !== undefined) {
        setSelectedRows(initialSelectedRows);
      }
    }, [initialSelectedRows]);

    useEffect(() => {
      const nextButton = document.querySelector('.next-button');

      const handleNextButtonClick = () => {
        if (currentPage < totalPages) {
          const value = currentPage + 1;
          setCurrentPage(value);
          onChangePage?.(value);
        }
      };

      if (nextButton) {
        nextButton.addEventListener('click', handleNextButtonClick);
      }

      return () => {
        if (nextButton) {
          nextButton.removeEventListener('click', handleNextButtonClick);
        }
      };
    }, [currentPage, totalPages, onChangePage]);

    useEffect(() => {
      const backButton = document.querySelector('.back-button');

      const handleNextButtonClick = () => {
        if (currentPage > 1) {
          const value = currentPage - 1;
          setCurrentPage(value);
          onChangePage?.(value);
        }
      };

      if (backButton) {
        backButton.addEventListener('click', handleNextButtonClick);
      }

      return () => {
        if (backButton) {
          backButton.removeEventListener('click', handleNextButtonClick);
        }
      };
    }, [currentPage, onChangePage]);

    useEffect(() => {
      const handleDocumentClick = (event: MouseEvent) => {
        const target = (event.target as Element).closest('.page-numbers');

        if (target) {
          const pElement = target.querySelector('p');

          if (pElement) {
            const value = parseInt(pElement?.textContent || '');
            if (!isNaN(value)) {
              setCurrentPage(value);
              onChangePage?.(value);
            }
          }
        }
      };

      document.addEventListener('click', handleDocumentClick);

      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, [onChangePage]);

    useEffect(() => {
      if (
        !!tableRef?.current?.state?.active_page_number &&
        currentPage <= totalPages
      ) {
        tableRef.current.state.active_page_number = currentPage;
      }
    }, [tableKey]);

    return (
      <>
        <div className="flex  flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            {search && (
              <div className="flex w-3/5 items-center gap-4">
                <FormInput
                  {...search}
                  startIcon="SearchIcon"
                  color="adminPortalBg"
                  className={`h-auto ${!!actionButton ? 'w-3/4' : 'w-full'}`}
                  isAdminPortalField
                />
                {!!filters?.length && (
                  <Button
                    type="filled"
                    color="adminPortalBg"
                    textColor="textMid"
                    className="text-textMid  mt-1 h-11 min-w-max whitespace-normal break-normal rounded-md px-2 py-0"
                    onClick={() => setOpenFilters(!openFilters)}
                  >
                    {!!selectedFilters?.length
                      ? `${selectedFilters?.length} `
                      : ''}
                    Filter
                    {renderIcon(
                      openFilters ? 'ChevronUpIcon' : 'ChevronDownIcon',
                      'text-textMid h-6 w-6'
                    )}
                  </Button>
                )}
              </div>
            )}
            <div className="ml-auto flex">
              {!!actionButton && actionButton.actionType !== 'date-picker' && (
                <Button
                  // @ts-ignore
                  type="filled"
                  // @ts-ignore
                  color="secondary"
                  textColor="white"
                  className="hover:bg-secondaryGG mt-1 h-11 w-full rounded-md px-2 py-0 lg:w-auto"
                  {...(actionButton as ButtonProps)}
                />
              )}
              {actionButton?.actionType === 'date-picker' && (
                <DatePicker {...(actionButton as DatePickerProps)} />
              )}
            </div>
          </div>
          {(!!Object.keys(search ?? {})?.length ||
            !!filters?.length ||
            !!Object.keys(actionButton ?? {})?.length) && (
            <div className="mt-8" />
          )}
          {openFilters && (
            <div className="mb-8 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {filters?.map((filterProps, index) => {
                  if (filterProps?.hideFilter) {
                    return null;
                  }

                  if (filterProps?.type === 'date-picker') {
                    return (
                      <DatePicker
                        key={`filter-${index}`}
                        className="w-56"
                        {...filterProps}
                      />
                    );
                  }

                  return (
                    <SearchDropDown<string>
                      isFullWidth={false}
                      key={`filter-${index}`}
                      bgColor="adminPortalBg"
                      color="secondary"
                      displayMenuOverlay
                      {...(filterProps as SearchDropDownProps<string>)}
                    />
                  );
                })}
              </div>
              <Button
                type="filled"
                color="transparent"
                className="text-secondary hover:text-secondaryGG mt-1 w-36 rounded-xl p-2 shadow-none"
                onClick={onClearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        {!!selectedRows?.length && (
          <div className="bg-infoMain flex w-full flex-row items-center justify-between py-2 px-4">
            <p className="text-md w-4/12 text-white">
              {selectedRows?.length} Selected
            </p>
            <div className="flex w-6/12 flex-row items-center justify-end gap-2">
              {bulkActions?.map((buttonProps, index) => (
                <Button
                  {...buttonProps}
                  key={buttonProps?.text || '' + index}
                  className={classNames(
                    'rounded-xl p-2',
                    buttonProps.className
                  )}
                  onClick={() => buttonProps?.onClick?.(selectedRows)}
                />
              ))}
            </div>
          </div>
        )}
        {loading?.isLoading ? (
          <LoadingSpinner {...loading} />
        ) : (
          <ReactTailwindTable
            ref={tableRef}
            key={tableKey}
            striped={false}
            show_search={false}
            should_export={false}
            bordered
            columns={mergedColumns}
            rows={mergedRows}
            styling={getStyles({ rows, rowsPerPage })}
            per_page={rowsPerPage}
            row_render={customRowElements}
            no_content_text={noContentText}
          />
        )}
      </>
    );
  }
);
