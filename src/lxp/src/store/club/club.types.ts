import { ClubDto, DetailClubDto } from '@/models/club/club.dto';
import { ActivityBeCreative, ActivityMeetRegular } from '@ecdlink/graphql';

export type Points = {
  meetRegularly?: ActivityMeetRegular;
  beCreative?: ActivityBeCreative;
};

export type ClubState = {
  clubForPractitioner?: ClubDto;
  clubsForCoach: {
    [clubId: string]: {
      dateLoaded: string;
      club: DetailClubDto;
      points?: Points;
    };
  };
};
