import { BaseClinicDto, SimpleClinicDto } from '../Clinics';

export interface LeagueInputModelInput {
  clinicIds: string[];
  districtId: string;
  name: string;
  typeId: string;
}

export interface LeagueWithClinics {
  id: string;
  name: string;
  clinics: SimpleClinicDto[];
}

export interface DistrictLeagues {
  id: string;
  name: string;
  leagues: LeagueWithClinics[];
  unassignedClinics: SimpleClinicDto[];
}

export interface LeagueSetupDto {
  superLeagues: LeagueWithClinics[];
  districts: DistrictLeagues[];
}

export interface PortalLeagueDto {
  clinics?: BaseClinicDto[];
  id: string;
  districtId?: string;
  districtName?: string;
  insertedDate: string;
  leagueTypeId: string;
  leagueTypeName?: string;
  name?: string;
}
