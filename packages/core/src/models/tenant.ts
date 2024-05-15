export interface TenantModel {
  adminSiteAddress: string;
  applicationName: string;
  id: string;
  moodleUrl: string;
  organisationName: string;
  siteAddress: string;
  tenantType: TenantType;
  themePath: string;
}

export enum TenantType {
  ChwConnect = 'CHW_CONNECT',
  Host = 'HOST',
  OpenAccess = 'OPEN_ACCESS',
  WhiteLabel = 'WHITE_LABEL',
  WhiteLabelTemplate = 'WHITE_LABEL_TEMPLATE',
  FundaApp = 'FUNDA_APP',
}
