import { ComponentBaseProps } from '@ecdlink/ui';

export interface UsePreviousReportPromptProps extends ComponentBaseProps {
  onProceed?: () => void;
  onClose?: () => void;
}
