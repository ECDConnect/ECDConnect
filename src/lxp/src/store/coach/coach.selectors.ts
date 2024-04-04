import {
  ClubDto,
  CoachCirclesDto,
  CoachDto,
  CoachingCircleTopicDto,
} from '@ecdlink/core';
import { RootState } from '../types';

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
    (
      topic // start date is compulsory in portal admin, but adding the check for incase
    ) =>
      (topic.startDate.toString() !== '' &&
        new Date(topic.startDate).getTime() <= new Date().getTime() &&
        (topic?.endDate?.toString() === '' || topic?.endDate === null)) ||
      (topic.startDate.toString() !== '' &&
        new Date(topic.startDate).getTime() <= new Date().getTime() &&
        (topic?.endDate?.toString() !== '' || topic?.endDate !== null) &&
        new Date(topic.endDate!).getTime() >= new Date().getTime())
  );
};
