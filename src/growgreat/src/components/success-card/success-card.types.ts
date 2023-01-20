import { Colours, ComponentBaseProps } from '@ecdlink/ui';
import { ReactElement } from 'react';

export interface SuccessCardProps extends ComponentBaseProps {
  icon?: string;
  customIcon?: ReactElement;
  text: string;
  subText?: string;
  color?: Colours;
  onClose?: () => void;
}
