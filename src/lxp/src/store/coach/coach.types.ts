import {
  CoachDto,
  CoachCirclesDto,
  ClubDto,
  CoachingCircleTopicDto,
} from '@ecdlink/core';

export interface CoachState {
  coach: CoachDto | undefined;
  coachCircles: CoachCirclesDto | undefined;
  coachClubs: ClubDto[] | undefined;
  coachCicleTopics?: CoachingCircleTopicDto[] | undefined;
}
