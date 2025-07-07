import { ComponentBaseProps } from '@ecdlink/ui';
import { ButtonProps } from '@ecdlink/ui/lib/components/button/button.types';

export interface IconInformationIndicatorProps extends ComponentBaseProps {
  title: string;
  subTitle: string;
  actions?: ButtonProps[];
  icon?: string;
}
