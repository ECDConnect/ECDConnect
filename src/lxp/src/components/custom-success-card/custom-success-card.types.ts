import { Colours, ComponentBaseProps } from '@ecdlink/ui';
import { ButtonProps } from '@ecdlink/ui/lib/components/button/button.types';
import { ReactElement } from 'react';

export interface CustomSuccessCardProps extends ComponentBaseProps {
  icon?: string;
  customIcon?: ReactElement;
  text: string;
  textColour?: Colours;
  subText?: string;
  subTextColours?: Colours;
  color?: Colours;
  button?: ButtonProps;
  onClose?: () => void;
}
