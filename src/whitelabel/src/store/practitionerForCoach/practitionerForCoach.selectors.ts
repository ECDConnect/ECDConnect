import { PractitionerDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getPractitionerForCoach = (
  state: RootState
): PractitionerDto | undefined =>
  state.practitionerForCoach.practitionerForCoach;

export const getPractitionersForCoach = (
  state: RootState
): PractitionerDto[] | undefined =>
  state.practitionerForCoach.practitionersForCoach;
