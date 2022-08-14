import { PractitionerDto } from '@ecdlink/core';
import { RootState } from '../types';
import { PrincipalPractitioners } from './practitioner.types';

export const getPractitioner = (
  state: RootState
): PractitionerDto | undefined => state.practitioner.practitioner;

export const getPractitioners = (
  state: RootState
): PractitionerDto[] | undefined => state.practitioner.practitioners;

export const getPrincipalPractitioners = (
  state: RootState
): PrincipalPractitioners[] | undefined =>
  state.practitioner.principalPractitioners;
