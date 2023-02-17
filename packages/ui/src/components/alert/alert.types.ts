import { ReactElement } from 'react';
import { Colours } from '../../models';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';

export type AlertVariant = 'flat' | 'outlined';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends ComponentBaseProps {
  type: AlertType;
  title?: string;
  message?: string;
  titleColor?: Colours;
  customIcon?: ReactElement;
  list?: Array<string>;
  button?: React.ReactElement;
  variant?: AlertVariant;
  listColor?: 'white' | 'black';
}
