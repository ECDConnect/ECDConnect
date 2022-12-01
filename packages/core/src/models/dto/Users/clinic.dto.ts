import { EntityBase } from '../entity-base';
import {} from '../StaticData/education-level.dto';
import { SiteAddressDto } from '../SiteAddress';

export interface ClinicDto extends EntityBase {
  name?: string;
  phoneNumber?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  emergencyContactPerson?: string;
  emergencyContactNumber?: string;
}
