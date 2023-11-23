import {
  ActivityChildProgressDto,
  DetailClubDto,
} from '@/models/club/club.dto';
import { LeagueClubsDto } from '@/models/club/league.dto';
import {
  BeCreativeActivityInput,
  ClubMeetingInput,
} from '@/services/ClubService/types';
import {
  ActivityBeCreative,
  ActivityHostFamilyDays,
  ActivityMeetRegular,
} from '@ecdlink/graphql';

export type Points = {
  meetRegularly?: ActivityMeetRegular;
  beCreative?: ActivityBeCreative;
  hostFamily?: ActivityHostFamilyDays;
  childProgressDetails?: ActivityChildProgressDto;
};

export type ClubState = {
  clubForPractitioner: {
    dateLoaded?: string;
    club?: DetailClubDto;
    points?: Points;
  };
  leagueForPractitioner: LeagueClubsDto | undefined;
  clubsForCoach: {
    [clubId: string]: {
      dateLoaded: string;
      club: DetailClubDto;
      points?: Points;
    };
  };
  addClubMeetingSyncInputs?: ClubMeetingInput[];
  addBeCreativeActivitySyncInputs?: BeCreativeActivityInput[];
  addFamilyDayMeetingSyncInputs?: ClubMeetingInput[];
};
