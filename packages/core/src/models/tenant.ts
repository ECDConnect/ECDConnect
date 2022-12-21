export interface TenantModel {
  adminSiteAddress: string;
  applicationName: string;
  organisationName: string;
  siteAddress: string;
  themePathVar: string;
  tenantType: TenantType;
  var1: string;
  var2: string;
  moodleUrlVar: string;
  Id: string;
}

export interface TenantType {
  Host: string;
  Tenant: string;
  organisationName: string;
}
