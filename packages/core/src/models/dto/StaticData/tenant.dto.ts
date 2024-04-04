import { EntityBase } from '../entity-base';
export interface TenantDto extends EntityBase {
  adminSiteAddress: string;
  applicationName: string;
  moodleUrlVar: string;
  organisationName: string;
  siteAddress: string;
  tenantType: string;
  themePathVar: string;
  var1: string;
  var2: string;
}
