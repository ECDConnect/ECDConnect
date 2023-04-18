import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgressTrackingTutorialProps extends ComponentBaseProps {
  onComplete?: () => void;
  onClose?: () => void;
}
