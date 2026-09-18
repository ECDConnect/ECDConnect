import { ReactElement } from 'react';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface PointsSuccessCardProps extends ComponentBaseProps {
  icon?: string;
  customIcon?: ReactElement;
  message?: string;
  isSmartStartUser?: boolean;
  prePointsText?: string;
  postPointsText?: string;
  points?: number;
  visible: boolean;
  onClose?: () => void;
}
