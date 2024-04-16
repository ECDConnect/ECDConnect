import { SimpleClinicDto } from '../Clinics';

interface LeagueWithClinics {
  id: string;
  name: string;
  clinics: SimpleClinicDto[];
}

interface District {
  id: string;
  name: string;
  leagues: LeagueWithClinics[];
  unassignedClinics: SimpleClinicDto[];
}

export interface LeagueSetupDto {
  superLeagues: LeagueWithClinics[];
  districts: District[];
}
