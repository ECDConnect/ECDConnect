import { Irow, ItableStyle } from 'react-tailwind-table';

export const getStyles = ({
  rows,
  rowsPerPage,
}: {
  rows: Irow;
  rowsPerPage: number;
}) =>
  ({
    base_bg_color: 'white',
    base_text_color: 'text-gray-900',
    top: {
      elements: {
        main: 'hidden',
      },
    },
    main: 'rounded-lg',
    table_head: {
      table_row: ` mb-10 border-b-2 border-secondary bg-blue-50`,
      table_data: `px-6 py-8 pl-6 pr-6 pt-4 pb-4 bg-quaternary text-left text-xs font-medium text-gray-500 uppercase tracking-wider leading-none`,
    },
    table_body: {
      main: 'text-left',
      table_row: 'border-none py-6 bg-white hover:bg-adminPortalBg text-left',
      table_data:
        'truncate px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-100 text-left',
    },
    footer: {
      main: `${
        rows?.length < rowsPerPage ? 'hidden' : ''
      } mt-8 mx-5 table-footer`,
      statistics: {
        main: `${
          rows?.length < rowsPerPage ? 'hidden' : ''
        } text-gray-600 table-stats md:w-auto md:flex-row`,
        bold_numbers: `text-gray-900 font-bold`,
      },
      page_numbers: ` text-secondary page-numbers z-10 relative inline-flex items-center px-4 py-2 text-sm font-medium w-4`,
    },
  } as ItableStyle);
