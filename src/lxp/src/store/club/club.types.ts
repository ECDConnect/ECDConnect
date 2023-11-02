import { ClubDto } from '@/models/club/club.dto';
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
  //allClubsForCoach?: MergedCoachingClub[];
  clubForPractitioner?: ClubDto;
  //points?: Points;
  clubsForCoach: {
    [clubId: string]: {
      dateLoaded: string;
      club: MergedCoachingClub;
      points?: Points;
    };
  };
};
