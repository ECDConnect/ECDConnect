import { UserDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgressTrackingAlertLevelTwoPromptProps extends ComponentBaseProps {
  childUser?: UserDto;
  onProceed?: () => void;
  onClose?: () => void;
}
