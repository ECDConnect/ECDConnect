import { ChildDto, UserDto } from '@ecdlink/core';

export type ChildrenState = {
  children: ChildDto[] | undefined;
  childUser: UserDto[] | undefined;
};
