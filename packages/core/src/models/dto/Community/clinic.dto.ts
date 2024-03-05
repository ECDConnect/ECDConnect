import {} from '../StaticData/education-level.dto';
import { SiteAddressDto } from '../SiteAddress';
import { TeamLeadDto } from '../Users/team-lead.dto';
import { SubDistrictDto } from './sub-district.dto';

export interface ClinicDto {
  id: string;
  name: string;
  phoneNumber: string;
  siteAddress?: SiteAddressDto;
  league?: LeagueDto;
  teamLeads: TeamLeadDto[];
  clinicMembers: ClinicMemberDto[];
  leagueRanking: number;
  pointsTotal: number;
  maxPointsTotal: number;
  isActive?: boolean;
  points?: ClinicPointsDto;
  subDistrict?: SubDistrictDto;
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
  healthCareWorkerId: string;
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
  points: PointsCategoryDto[];
}

export interface PointsCategoryDto {
  pointsCategoryId: string;
  pointsTotal: string;
  categoryName: string;
}
