import { CoachingClub, CoachingClubBase } from '@ecdlink/graphql';

export type MergedCoachingClub = CoachingClubBase & CoachingClub;

export type ClubState = {
  allClubsForCoach?: MergedCoachingClub[];
};
