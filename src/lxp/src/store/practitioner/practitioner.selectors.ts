import { PractitionerDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getPractitioner = (
  state: RootState
): PractitionerDto | undefined => state.practitioner.practitioner;

export const getPractitioners = (
  state: RootState
): PractitionerDto[] | undefined => state.practitioner.practitioners;
