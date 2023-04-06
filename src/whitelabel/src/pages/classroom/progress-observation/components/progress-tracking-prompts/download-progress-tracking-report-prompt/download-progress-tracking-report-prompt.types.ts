import { ComponentBaseProps } from '@ecdlink/ui';

export interface DownloadProgressTrackingReportPromptProps
  extends ComponentBaseProps {
  onProceed?: () => void;
  onClose?: () => void;
}
