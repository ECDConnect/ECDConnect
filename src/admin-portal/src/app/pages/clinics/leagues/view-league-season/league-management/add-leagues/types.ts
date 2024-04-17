import { LeagueIdEnum } from '@ecdlink/core';
import { LeagueSeasonRouteState } from '../../types';

export interface AddLeaguesRouteState extends LeagueSeasonRouteState {
  districtId?: string;
  leagueType: LeagueIdEnum;
}
