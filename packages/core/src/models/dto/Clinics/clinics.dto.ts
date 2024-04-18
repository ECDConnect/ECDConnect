export interface BaseTeamLeadDto {
  firstName: string;
  id: string;
  surname: string;
}

export interface SimpleClinicDto {
  id: string;
  name: string;
  subDistrictName: string;
  teamLeads: BaseTeamLeadDto[];
}
