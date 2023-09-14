import { ClubDto, CoachCirclesDto, CoachDto, ConsentDto } from '@ecdlink/core';
import { RootState } from '../types';
import { MoreInformation } from '@ecdlink/graphql';

export const getCoach = (state: RootState): CoachDto | undefined =>
  state.coach.coach;

export const getCoachCircles = (
  state: RootState
): CoachCirclesDto | undefined => state.coach.coachCircles;

export const getCoachClubs = (state: RootState): ClubDto[] | undefined =>
  state.coach.coachClubs;

export const getCircleTopics = (
  state: RootState
): ConsentDto | ConsentDto[] | undefined => state.coach.coachCicleTopics;
