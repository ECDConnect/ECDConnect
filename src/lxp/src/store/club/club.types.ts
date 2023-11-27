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
  ActivityChildAttendance,
  ActivityHostFamilyDays,
  ActivityLeaveNoOneBehind,
  ActivityMeetRegular,
} from '@ecdlink/graphql';

export type Points = {
  meetRegularly?: ActivityMeetRegular;
  beCreative?: ActivityBeCreative;
  hostFamily?: ActivityHostFamilyDays;
  leaveNoOneBehind?: ActivityLeaveNoOneBehind;
  childProgressDetails?: ActivityChildProgressDto;
  childAttendance?: ActivityChildAttendance;
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
  leaguesForCoach: LeagueClubsDto[];

  dateLeagueDataLoaded: string | undefined;

  addClubMeetingSyncInputs?: ClubMeetingInput[];
  addBeCreativeActivitySyncInputs?: BeCreativeActivityInput[];
  addFamilyDayMeetingSyncInputs?: ClubMeetingInput[];
};
