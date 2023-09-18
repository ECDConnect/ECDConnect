import { Colours, ComponentBaseProps } from '@ecdlink/ui';
import { ReactElement } from 'react';

export interface CustomSuccessCardProps extends ComponentBaseProps {
  icon?: string;
  customIcon?: ReactElement;
  text: string;
  textColour?: Colours;
  subText?: string;
  subTextColours?: Colours;
  color?: Colours;
  onClose?: () => void;
}
