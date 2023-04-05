import { ComponentBaseProps } from '@ecdlink/ui';

export interface NotificationHeaderCardProps extends ComponentBaseProps {
  header: string;
  message: string;
  actionText?: string;
  onActioned?: () => void;
}
