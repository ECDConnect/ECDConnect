import { CoachDto, RoleSystemNameEnum } from '@ecdlink/core';
import { RootState } from '../types';

export const getCoach = (state: RootState): CoachDto | undefined =>
  state.coach.coach;
