import { CoachDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getCoach = (state: RootState): CoachDto | undefined =>
  state.coach.coach;

export const getCoachCircles = (state: RootState): CoachDto | undefined =>
  state.coach.coachCircles;
