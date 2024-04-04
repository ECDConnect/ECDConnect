interface UiTableProps {
  rows: any;
  columns: any;
  options?: any;
  viewRow?: any;
  editRow?: any;
  urlRow?: any;
  sendRow?: any;
  deleteRow?: any;
  searchInput?: any;
  component?: any;
  showSearch?: boolean;
  showSelect?: boolean;
}

interface Iprop {
  styling?: ItableStyle;
  rows: Irow[];
  columns: Icolumn[];
  per_page?: number;
  table_header?: string;
  no_content_text?: string;
  debounce_search?: number;
  show_search?: boolean;
  should_export?: boolean;
  export_text?: string;
  bulk_select_options?: string[];
  bulk_select_button_text?: string;
  export_csv_file?: string;
  striped?: boolean;
  bordered?: boolean;
  hovered?: boolean;
  row_render?: (row: Irow, col: Icolumn, display_value: string) => string;
  on_search?: (search_word: string, result?: Irow[] | []) => void;
  export_modify?: (row: Irow, col: Icolumn, display_value: string) => string;
  on_bulk_action?: (selected_option: string, selected: Irow[]) => void;
}

interface Icolumn {
  // Used to get string data from the each row object
  field: string; // This field can have a full stop(.) will allow us to read further into nested objects
  // This will be used to display in the table heading.
  use: string;
  // Indicates that of this column should be used to search (optional). defaults to true.
  use_in_search?: boolean;
  // Indicates If this property should be used displayed in the table header (optional). defaults to true.
  use_in_display?: boolean;
  // Indicates if this field can be exported on the CSV (optional) defaults to true.
  use_in_export?: boolean;
}

type Icolumns = Icolumn[];

interface Irow {
  [key: string]: any;
}

type Irows = Irow[];

interface ItableStyle {
  base_bg_color?: string; // defaults to  bg-pink-700
  base_text_color?: string; // defaults to text-pink-700
  main?: string; // The container holding the table
  top?: {
    title?: string;
    elements?: {
      // The elements include the search, bulk select and csv download components
      main?: string; // The row holding these components
      search?: string;
      bulk_select?: {
        main?: string; // styling targets the dropdown
        button?: string;
      };
      export?: string;
    };
  };
  table_head?: {
    table_row?: string; // The <tr/> holding all <th/>
    table_data?: string; // each table head column
  };
  table_body?: {
    main?: string; // main here targets <tbody/>
    table_row?: string;
    table_data?: string;
  };
  footer?: {
    main?: string; // row holding the footer
    statistics?: {
      // those shiny numbers like **Showing 1 to 5 of 58 entries**
      main?: string;
      bold_numbers?: string; // The numbers like 1, 5, 58
    };
    page_numbers?: string; // the number boxes
  };
}
