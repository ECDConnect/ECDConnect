import { CoachDto, CoachCirclesDto } from '@ecdlink/core';

export interface CoachState {
  coach: CoachDto | undefined;
  coachCircles: CoachCirclesDto | undefined;
}
