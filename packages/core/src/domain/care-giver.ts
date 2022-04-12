import { GrantDto } from '../models/dto/StaticData/grant.dto';
import { EntityCacheBase } from './entity-cache-base';
import { SiteAddress } from './site-address';

export interface Caregiver extends EntityCacheBase {
  id?: number;
  phoneNumber: string;
  idNumber: string;
  firstName: string;
  surname: string;
  fullName?: string;
  siteAddressId?: number;
  siteAddress?: SiteAddress;
  relationId?: number;
  educationId?: number;
  emergencyContactFirstName: string;
  emergencyContactSurname: string;
  emergencyContactPhoneNumber: string;
  additionalFirstName: string;
  additionalSurname: string;
  additionalPhoneNumber: string;
  joinReferencePanel: boolean;
  contribution: boolean;
  grants?: GrantDto[];
}
