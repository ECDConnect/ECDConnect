export interface TenantModel {
  adminSiteAddress: string;
  applicationName: string;
  id: string;
  moodleUrl: string;
  organisationName: string;
  organisationEmail: string;
  siteAddress: string;
  tenantType: TenantType;
  themePath: string;
  modules: {
    attendanceEnabled: boolean;
    businessEnabled: boolean;
    calendarEnabled: boolean;
    classroomActivitiesEnabled: boolean;
    coachRoleEnabled: boolean;
    coachRoleName: string;
    progressEnabled: boolean;
    trainingEnabled: boolean;
  } | null;
  googleAnalyticsTag: string;
  googleTagManager: string;
  blobStorageAddress: string;
}

export enum TenantType {
  ChwConnect = 'CHW_CONNECT',
  Host = 'HOST',
  OpenAccess = 'OPEN_ACCESS',
  WhiteLabel = 'WHITE_LABEL',
  WhiteLabelTemplate = 'WHITE_LABEL_TEMPLATE',
  FundaApp = 'FUNDA_APP',
}
