export type LeagueClubsDto = {
  id: string;
  name: string;
  leagueTypeId: string;
  leagueTypeName: string;
  clubs: ClubPointsSummaryDto[];
};

export type ClubPointsSummaryDto = {
  clubId: string;
  clubName: string;
  leagueRank: number;
  pointsTotal: number;
  coachName: string;
};
