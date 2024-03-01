import { ClinicDto, LeagueWithClinicRankingsDto } from '@ecdlink/core';
import { Connect, ConnectItem, MoreInformation } from '@ecdlink/graphql';

export interface CommunityState {
  connect?: Connect[];
  connectItem?: ConnectItem[];
  team?: {
    clinic?: {
      dateLoaded: string;
      data: ClinicDto;
    };
    activityInfo?: {
      [activitySlug: string]: {
        [locale: string]: {
          dateLoaded: string;
          data: MoreInformation[];
        };
      };
    }[];
    earnPointsInfo?: {
      [locale: string]: {
        dateLoaded: string;
        data: MoreInformation[];
      };
    }[];
  };
  league?: LeagueWithClinicRankingsDto;
}
