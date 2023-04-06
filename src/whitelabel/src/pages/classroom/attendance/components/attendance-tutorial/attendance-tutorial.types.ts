import { ComponentBaseProps } from '@ecdlink/ui';

export interface AttendanceTutorialProps extends ComponentBaseProps {
  onComplete: () => void;
  onClose: () => void;
}
