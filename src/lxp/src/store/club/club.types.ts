import { DetailClubDto } from '@/models/club/club.dto';
import {
  BeCreativeActivityInput,
  ClubMeetingInput,
} from '@/services/ClubService/types';
import {
  ActivityBeCreative,
  ActivityHostFamilyDays,
  ActivityLeaveNoOneBehind,
  ActivityMeetRegular,
} from '@ecdlink/graphql';

export type Points = {
  meetRegularly?: ActivityMeetRegular;
  beCreative?: ActivityBeCreative;
  hostFamily?: ActivityHostFamilyDays;
  leaveNoOneBehind?: ActivityLeaveNoOneBehind;
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
  addFamilyDayMeetingSyncInputs?: ClubMeetingInput[];
};
