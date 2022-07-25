import { ComponentBaseProps } from '../../models/ComponentBaseProps';

export type AlertVariant = 'flat' | 'outlined';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends ComponentBaseProps {
  type: AlertType;
  title?: string;
  message?: string;
  list?: Array<string>;
  button?: React.ReactElement;
  variant?: AlertVariant;
  listColor?: 'white' | 'black';
}
