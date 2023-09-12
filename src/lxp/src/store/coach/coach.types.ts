import { CoachDto, CoachCirclesDto, ClubDto } from '@ecdlink/core';

export interface CoachState {
  coach: CoachDto | undefined;
  coachCircles: CoachCirclesDto | undefined;
  coachClubs: ClubDto[] | undefined;
}
