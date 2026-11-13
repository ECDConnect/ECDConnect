import { Irow, ItableStyle } from 'react-tailwind-table';

// When a leading checkbox/select column is present it is always the first
// column, so squeeze the first header/body cell down to just the checkbox.
export const selectColumnClasses =
  '[&_thead_th:first-child]:w-px [&_thead_th:first-child]:pl-4 [&_thead_th:first-child]:pr-2 ' +
  '[&_tbody_td:first-child]:w-px [&_tbody_td:first-child]:pl-4 [&_tbody_td:first-child]:pr-2';

export const getStyles = ({
  rows,
  rowsPerPage,
  hasSelectColumn,
}: {
  rows: Irow;
  rowsPerPage: number;
  hasSelectColumn?: boolean;
}) =>
  ({
    base_bg_color: 'white',
    base_text_color: 'text-textDark',
    top: {
      elements: {
        main: 'hidden',
      },
    },
    main: hasSelectColumn ? selectColumnClasses : '',
    table_head: {
      table_row: `border-b-2 border-quatenary bg-adminPortalBg`,
      table_data: `px-6 py-4 bg-adminPortalBg text-left text-sm font-semibold normal-case tracking-normal text-textMid whitespace-nowrap leading-none`,
    },
    table_body: {
      main: 'text-left',
      table_row:
        'border-none bg-white transition-colors hover:bg-adminPortalBg text-left',
      table_data:
        'truncate px-6 py-3 text-sm font-medium text-textMid border-b border-uiLight text-left align-middle',
    },
    footer: {
      main: `${
        rows?.length < rowsPerPage ? 'hidden' : ''
      } mt-6 mx-5 table-footer`,
      statistics: {
        main: `${
          rows?.length < rowsPerPage ? 'hidden' : ''
        } text-textMid table-stats md:w-auto md:flex-row`,
        bold_numbers: `text-textDark font-bold`,
      },
      page_numbers: ` text-quatenary page-numbers z-10 relative inline-flex items-center px-4 py-2 text-sm font-medium w-4`,
    },
  } as ItableStyle);
