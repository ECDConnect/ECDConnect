import { FieldValues } from 'react-hook-form';
import { Irow, Icolumn } from 'react-tailwind-table';
import { ButtonProps } from '../button/button.types';
import { FormFieldProps } from '../form-fields/form-input/form-input';
import { SearchDropDownProps } from '../dropdown/search-dropdown/search-dropdown';
import { DatePickerRangeProps, DatePickerSingleProps } from '../date-picker';
import { LoadingSpinnerProps } from '../loading-spinner/loading-spinner';

interface BulkAction extends Omit<ButtonProps, 'onClick'> {
  onClick?: (selected: Irow[]) => void;
}

interface IButton extends Omit<ButtonProps, 'type' | 'color' | 'icon'> {
  icon?: string;
  actionType?: 'button';
  type?: ButtonProps['type'];
  color?: ButtonProps['color'];
}

interface ISearchDropDown extends SearchDropDownProps<string> {
  type?: 'search-dropdown';
}

type IDatePickerFilter = {
  type?: 'date-picker';
} & (DatePickerSingleProps | DatePickerRangeProps);

type IDatePicker = {
  actionType?: 'date-picker';
} & (DatePickerSingleProps | DatePickerRangeProps);

type Filter = { hideFilter?: boolean } & (ISearchDropDown | IDatePickerFilter);

type ActionButton = IButton | IDatePicker;

interface Loading extends LoadingSpinnerProps {
  isLoading: boolean;
}

export interface TableProps {
  /**
   * Indicates whether the component should watch modifications on list elements for efficient updating.
   */
  watchMode?: boolean;
  selectedRows?: Irow[];
  multiSelect?: boolean;
  columns: Icolumn[];
  rows: Irow[];
  rowsPerPage?: number;
  search?: FormFieldProps<FieldValues>;
  actionButton?: ActionButton;
  bulkActions?: BulkAction[];
  filters?: Filter[];
  loading?: Loading;
  noContentText?: string;
  onClearFilters?: () => void;
  onClickRow?: (row: Irow) => void;
  onChangePage?: (page: number) => void;
  onChangeSelectedRows?: (rows: Irow[]) => void;
  styling?: ItableStyle;
}

export interface TableRefMethods {
  resetSelectedRows: () => void;
}

interface ItableStyle {
  base_bg_color?: string; // defaults to  bg-pink-700
  base_text_color?: string; // defaults to text-pink-700
  main?: string; // The container holding the table
  table_head?: {
    table_row?: string; // The <tr/> holding all <th/>
    table_data?: string; // each table head column
  };
  table_body?: {
    main?: string; // main here targets <tbody/>
    table_row?: string;
    table_data?: string;
  };
}
