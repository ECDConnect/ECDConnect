import { ReactElement } from 'react';
import { Colours } from '../../models';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';

export type AlertVariant = 'flat' | 'outlined';

export type AlertType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'successLight';

export interface AlertProps extends ComponentBaseProps {
  type: AlertType;
  title?: string;
  titleColor?: Colours;
  customMessage?: ReactElement;
  message?: string;
  messageColor?: Colours;
  customIcon?: ReactElement;
  list?: Array<string>;
  button?: React.ReactElement;
  variant?: AlertVariant;
  listColor?: Colours;
}
