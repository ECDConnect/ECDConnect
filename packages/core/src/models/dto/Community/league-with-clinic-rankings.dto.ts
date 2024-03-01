import {} from '../StaticData/education-level.dto';

export interface LeagueWithClinicRankingsDto {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  leagueTypeId: string;
  leagueTypeName: string;
  clinics: LeagueClinicPointsDto[];
}

export interface LeagueClinicPointsDto {
  clinicId: string;
  clinicName: string;
  leagueRanking: number;
  pointsTotal: number;
}
