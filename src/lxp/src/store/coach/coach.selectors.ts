import { ClubDto, CoachCirclesDto, CoachDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getCoach = (state: RootState): CoachDto | undefined =>
  state.coach.coach;

export const getCoachCircles = (
  state: RootState
): CoachCirclesDto | undefined => state.coach.coachCircles;

export const getCoachClubs = (state: RootState): ClubDto[] | undefined =>
  state.coach.coachClubs;
