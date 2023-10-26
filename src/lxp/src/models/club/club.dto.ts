export type ClubDto = {
  id: string;
  name: string;
  pointsTotal: number;
  maxPointsTotal: number;
  leagueRanking: number;
  league: LeagueDto;
};

export type LeagueDto = {
  id: string;
  name: string;
  leagueTypeId: string;
  leagueTypeName: string;
};
