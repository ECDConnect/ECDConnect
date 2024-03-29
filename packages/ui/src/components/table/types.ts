import { FieldValues } from 'react-hook-form';
import { Irow, Icolumn } from 'react-tailwind-table';
import { ButtonProps } from '../button/button.types';
import { FormFieldProps } from '../form-fields/form-input/form-input';
import { SearchDropDownProps } from '../dropdown/search-dropdown/search-dropdown';

interface BulkAction extends Omit<ButtonProps, 'onClick'> {
  onClick?: (selected: Irow[]) => void;
}

interface ActionButton extends Omit<ButtonProps, 'type' | 'color'> {
  type?: ButtonProps['type'];
  color?: ButtonProps['color'];
}

export interface TableProps {
  columns: Icolumn[];
  rows: Irow[];
  rowsPerPage?: number;
  search?: FormFieldProps<FieldValues>;
  actionButton?: ActionButton;
  bulkActions?: BulkAction[];
  filters?: SearchDropDownProps<string>[];
  onClearFilters?: () => void;
  onClickRow?: (row: Irow) => void;
  onChangePage?: (page: number) => void;
}
