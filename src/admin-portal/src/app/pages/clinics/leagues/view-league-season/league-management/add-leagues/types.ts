import { LeagueIdEnum, LeagueWithClinics } from '@ecdlink/core';
import { LeagueSeasonRouteState } from '../../types';

export interface AddLeaguesRouteState extends LeagueSeasonRouteState {
  allowMultipleLeagues: boolean;
  districtId?: string;
  leagueType: LeagueIdEnum;
  leagueToEdit?: LeagueWithClinics;
}
