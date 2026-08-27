import { Typography } from '@ecdlink/ui';

// Table's own pager/footer only hides when rows.length < rowsPerPage. Since consumers of
// this component hand Table exactly one server page at a time (<= a page's worth of rows),
// a rowsPerPage this large keeps that guard true and stops Table rendering its own
// (non-functional, single-page) pager underneath this real Prev/Next control.
export const TABLE_ROWS_PER_PAGE = 1000;

// Mirrors the chevron icon/colours react-tailwind-table renders for its own
// next-button/back-button, so this pager reads as one visual system with the table.
const PagerArrowButton = ({
  direction,
  disabled,
  onClick,
}: {
  direction: 'back' | 'next';
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label={direction === 'back' ? 'Previous page' : 'Next page'}
    disabled={disabled}
    onClick={onClick}
    className={`flex h-7 w-7 items-center justify-around border-r border-gray-200 text-sm last:border-r-0 md:h-8 md:w-8 ${
      disabled
        ? 'cursor-not-allowed text-gray-400'
        : 'text-quatenary cursor-pointer'
    }`}
  >
    <svg
      className={`fill-current ${
        direction === 'back' ? 'rotate-180 transform' : ''
      }`}
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.772277 9.90938L0.837937 9.85312L5.73111 5.60312C5.89682 5.45937 6 5.24375 6 5.00313C6 4.7625 5.89369 4.54688 5.73111 4.40312L0.847317 0.15625L0.766024 0.0843749C0.687858 0.0312499 0.59406 0 0.494007 0C0.221991 0 0 0.23125 0 0.51875V9.48125C0 9.76875 0.221991 10 0.494007 10C0.597186 10 0.694111 9.96562 0.772277 9.90938Z" />
    </svg>
  </button>
);

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  countLoading?: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  totalCount,
  countLoading,
  isLoading,
  onPageChange,
}: TablePaginationProps) => (
  <div className="mt-4 flex items-center justify-between px-2">
    <div className="flex items-center gap-1">
      <Typography type="help" color="textMid" text="Page" />
      <Typography
        type="help"
        color="textMid"
        weight="bold"
        text={`${currentPage}`}
      />
      <Typography type="help" color="textMid" text="of" />
      <Typography
        type="help"
        color="textMid"
        weight="bold"
        text={`${totalPages}`}
      />
      <Typography type="help" color="textMid" text="—" />
      <Typography
        type="help"
        color="textMid"
        weight="bold"
        text={countLoading ? '...' : `${totalCount}`}
      />
      <Typography type="help" color="textMid" text="entries" />
    </div>
    <div className="flex overflow-hidden rounded border border-gray-200">
      <PagerArrowButton
        direction="back"
        disabled={currentPage <= 1 || !!isLoading}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <PagerArrowButton
        direction="next"
        disabled={currentPage >= totalPages || !!isLoading}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  </div>
);

export default TablePagination;
