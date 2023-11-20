import { DetailClubDto } from '@/models/club/club.dto';
import {
  BeCreativeActivityInput,
  ClubMeetingInput,
} from '@/services/ClubService/types';
import { ActivityBeCreative, ActivityMeetRegular } from '@ecdlink/graphql';

export type Points = {
  meetRegularly?: ActivityMeetRegular;
  beCreative?: ActivityBeCreative;
};

export type ClubState = {
  clubForPractitioner: {
    dateLoaded?: string;
    club?: DetailClubDto;
    points?: Points;
  };
  clubsForCoach: {
    [clubId: string]: {
      dateLoaded: string;
      club: DetailClubDto;
      points?: Points;
    };
  };
  addClubMeetingSyncInputs?: ClubMeetingInput[];
  addBeCreativeActivitySyncInputs?: BeCreativeActivityInput[];
};
