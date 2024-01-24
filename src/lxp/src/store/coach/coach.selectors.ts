import {
  ClubDto,
  CoachCirclesDto,
  CoachDto,
  CoachingCircleTopicDto,
} from '@ecdlink/core';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { isAfter } from 'date-fns';

export const getCoach = (state: RootState): CoachDto | undefined =>
  state.coach.coach;

export const getCoachCircles = (
  state: RootState
): CoachCirclesDto | undefined => state.coach.coachCircles;

export const getCoachClubs = (state: RootState): ClubDto[] | undefined => {
  if (state.user.user?.roles?.some((role) => role.name === 'Coach'))
    return state.coach.coachClubs;
  return undefined;
};

export const getCircleTopics = (
  state: RootState
): CoachingCircleTopicDto[] | undefined => {
  return state.coach?.coachCicleTopics?.filter(
    (topic) =>
      topic.startDate.toString() !== '' && topic.startDate <= new Date()
  );
};
