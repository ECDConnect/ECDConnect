export type DetailClubDto = ClubDto & {
  incomingClubLeader: ClubLeaderDto;
  issuesTasks: IssueTask[];
  clubActivities: ClubActivity[];
};

export type ClubDto = {
  id: string;
  name: string;
  clubCoach: ClubCoachDto;
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
  practitionerId: string;
  firstName: string;
  surname: string;
  phoneNumber: string;
  whatsAppNumber: string;
  profileImageUrl: string;
  welcomeMessage: string;
  shareContactInfo: boolean;
};
export type ClubCoachDto = {
  userId: string;
  practitionerId: string;
  firstName: string;
  surname: string;
  phoneNumber: string;
  whatsAppNumber: string;
  profileImageUrl: string;
  aboutInfo: string;
};

export type ClubLeaderDto = {
  userId: string;
  practitionerId: string;
  firstName: string;
  surname: string;
  phoneNumber: string;
  profileImageUrl: string;
  dateAccepted: string;
  dateAssigned: string;
};

export type ClubSupportDto = {
  userId: string;
  practitionerId: string;
  firstName: string;
  surname: string;
  phoneNumber: string;
  profileImageUrl: string;
  dateAssigned: string;
};

export type IssueTask = {
  secondaryText: string;
  secondaryTextColor: string;
  secondaryDescription: string;
};

export type ClubActivity = {
  name: string;
  points: number;
};
