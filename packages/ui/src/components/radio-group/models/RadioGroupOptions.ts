import { ReactElement } from 'react';

export interface RadioGroupOption {
  id: number;
  label: string;
  value: any;
  icon?: ReactElement;
}
