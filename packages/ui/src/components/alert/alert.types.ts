import { ReactElement } from 'react';
import { Colours } from '../../models';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { TypographyType } from '../typography/models/TypographyTypes';

export type AlertVariant = 'flat' | 'outlined';

export type AlertType =
  | 'infoDark'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'successLight';

export interface AlertProps extends ComponentBaseProps {
  type: AlertType;
  title?: string;
  titleType?: TypographyType;
  titleColor?: Colours;
  customMessage?: ReactElement;
  message?: string;
  messageColor?: Colours;
  customIcon?: ReactElement;
  list?: Array<string>;
  button?: React.ReactElement;
  variant?: AlertVariant;
  listColor?: Colours;
  leftChip?: string;
  rightChip?: string;
  onDismiss?: () => void;
}
