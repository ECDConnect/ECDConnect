import { Path } from 'react-hook-form';

export interface DialogFormInput<T> {
  label: string;
  formFieldName: Path<T>;
  value?: string;
}
