import { ComponentBaseProps } from '@ecdlink/ui';

export interface SuccessCardProps extends ComponentBaseProps {
  icon: string;
  text: string;
  subText?: string;
  onClose?: () => void;
}
