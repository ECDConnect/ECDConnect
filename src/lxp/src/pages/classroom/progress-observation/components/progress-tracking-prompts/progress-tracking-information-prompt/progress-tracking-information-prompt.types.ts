import { UserDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ProgressTrackingInformationPromptProps
  extends ComponentBaseProps {
  childUser?: UserDto;
  onClose?: () => void;
}
