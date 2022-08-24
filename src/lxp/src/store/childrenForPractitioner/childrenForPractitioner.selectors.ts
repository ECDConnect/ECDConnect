import { ChildDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getChildForPractitioner = (
  state: RootState
): ChildDto | undefined => state.childrenForPractitioner.childForPractitioner;

export const getChildrenForPractitioner = (
  state: RootState
): ChildDto[] | undefined =>
  state.childrenForPractitioner.childrenForPractitioner;
