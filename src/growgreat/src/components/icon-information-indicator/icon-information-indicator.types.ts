import { ComponentBaseProps } from '@ecdlink/ui';
import { ButtonProps } from '@ecdlink/ui/lib/components/button/button.types';
import { ReactElement } from 'react';

export interface IconInformationIndicatorProps extends ComponentBaseProps {
  title: string;
  subTitle: string;
  actions?: ButtonProps[];
  icon?: string;
  renderCustomIcon?: ReactElement;
}
