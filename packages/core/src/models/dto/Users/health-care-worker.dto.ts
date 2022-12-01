import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress/site-address.dto';
import { UserDto } from './user.dto';
import {} from '../StaticData/education-level.dto';
import { DocumentDto } from '../Documents/document.dto';

export interface HealthCareWorkerDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  consentForPhoto?: boolean;
  isRegistered?: boolean;
  language?: string;
  languageId?: string;
  documents?: DocumentDto[];
  emergencyContactPerson?: string;
  emergencyContactNumber?: string;
  teamLeadId?: string;
  teamLead?: {
    jobTitle?: string;
    clinic?: {
      name?: string;
      phoneNumber?: string;
    };
  };
}
