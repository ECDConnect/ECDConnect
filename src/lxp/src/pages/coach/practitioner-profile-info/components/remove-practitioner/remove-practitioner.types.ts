import { ComponentBaseProps } from '@ecdlink/ui';

export interface RemovePractionerProps extends ComponentBaseProps {
  removeReasonId?: string;
  onSuccess: Function;
}
