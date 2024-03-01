import {} from '../StaticData/education-level.dto';
import { SiteAddressDto } from '../SiteAddress';
import { TeamLeadDto } from '../Users/team-lead.dto';

export interface ClinicDto {
  id: string;
  name: string;
  phoneNumber: string;
  siteAddress?: SiteAddressDto;
  league?: LeagueDto;
  teamLeads: TeamLeadDto[];
  clinicMembers: ClinicMemberDto[];
  points?: ClinicPointsDto;
}

export interface LeagueDto {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  leagueTypeId: string;
  leagueTypeName: string;
}

export interface ClinicMemberDto {
  firstName: string;
  surname: string;
  phoneNumber: string;
  whatsAppNumber: string;
  profileImageUrl: string;
  welcomeMessage: string;
  shareContactInfo: boolean;
}

export interface ClinicPointsDto {
  leagueRanking: number;
  pointsTotal: number;
  maxPointsTotal: number;
  points: PointsActivityDto[];
}

export interface PointsActivityDto {
  pointsLibraryId: string;
  pointsTotal: string;
  activityName: string;
  subActivityName: string;
}
