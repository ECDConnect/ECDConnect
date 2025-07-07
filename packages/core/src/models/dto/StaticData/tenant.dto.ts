import { EntityBase } from '../entity-base';
export interface TenantDto extends EntityBase {
  adminSiteAddress: string;
  applicationName: string;
  moodleUrl: string;
  organisationName: string;
  siteAddress: string;
  tenantType: string;
  themePath: string;
  modules: {
    attendanceEnabled: boolean;
    businessEnabled: boolean;
    calendarEnabled: boolean;
    classroomActivitiesEnabled: boolean;
    coachRoleEnabled: boolean;
    coachRoleName: string;
    prgoressEnabled: boolean;
    trainingEnabled: boolean;
  } | null;
  googleAnalyticsTag: string;
  googleTagManager: string;
  blobStorageAddress: string;
}
