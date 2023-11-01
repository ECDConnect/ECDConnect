export type ClubDto = {
  id: string;
  name: string;
  coachUserId: string;
  pointsTotal: number;
  maxPointsTotal: number;
  leagueRanking: number;
  league: LeagueDto;
  clubLeader: ClubLeaderDto;
  clubSupport: ClubSupportDto;
  clubMembers: ClubMemberDto[];
};

export type LeagueDto = {
  id: string;
  name: string;
  leagueTypeId: string;
  leagueTypeName: string;
};

export type ClubMemberDto = {
  userId: string;
  name: string;
  phoneNumber: string;
  welcomeMessage: string;
};

export type ClubLeaderDto = {
  userId: string;
  name: string;
  phoneNumber: string;
  dateAccepted: string;
};

export type ClubSupportDto = {
  userId: string;
  name: string;
  phoneNumber: string;
  dateAccepted: string;
};
