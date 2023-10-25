import {
  ActivityMeetRegular,
  CoachingClub,
  CoachingClubBase,
} from '@ecdlink/graphql';

export type MergedCoachingClub = CoachingClubBase & CoachingClub;

export type Points = {
  meetRegularly: ActivityMeetRegular;
};

export type ClubState = {
  allClubsForCoach?: MergedCoachingClub[];
  points?: Points;
};
