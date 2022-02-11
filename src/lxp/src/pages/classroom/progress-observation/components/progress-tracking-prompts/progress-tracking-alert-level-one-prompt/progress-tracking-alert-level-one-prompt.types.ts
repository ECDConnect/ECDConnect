import { UserDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgressTrackingAlertLevelOnePromptProps extends ComponentBaseProps {
  childUser?: UserDto;
  onProceed?: () => void;
  onClose?: () => void;
}
