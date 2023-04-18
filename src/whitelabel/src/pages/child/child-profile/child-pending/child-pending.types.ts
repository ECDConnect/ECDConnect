import { ChildDto, UserDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ChildPendingProps extends ComponentBaseProps {
  child: ChildDto;
  childUser?: UserDto;
}
