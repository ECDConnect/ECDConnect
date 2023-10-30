import {
  ActivityBeCreative,
  ActivityMeetRegular,
  CoachingClub,
  CoachingClubBase,
} from '@ecdlink/graphql';

export type MergedCoachingClub = CoachingClubBase & CoachingClub;

export type Points = {
  meetRegularly?: ActivityMeetRegular;
  beCreative?: ActivityBeCreative;
};

export type ClubState = {
  allClubsForCoach?: MergedCoachingClub[];
  points?: Points;
};
