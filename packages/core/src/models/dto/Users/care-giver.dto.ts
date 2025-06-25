import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress/site-address.dto';
import { RelationDto, EducationLevelDto } from '../StaticData';

export interface CaregiverDto extends EntityBase {
  phoneNumber: string;
  idNumber?: string;
  firstName: string;
  surname: string;
  fullName?: string;
  whatsAppNumber?: string;
  age?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  relation?: RelationDto;
  relationId?: string;
  education?: EducationLevelDto;
  educationId?: string;
  emergencyContactFirstName?: string;
  emergencyContactSurname?: string;
  emergencyContactPhoneNumber?: string;
  additionalFirstName?: string;
  additionalSurname?: string;
  additionalPhoneNumber?: string;
  joinReferencePanel?: boolean;
  contribution?: boolean;
  grants?: string[] | undefined;
  isOnline?: boolean;
  isAllowedCustody?: boolean;
}

export interface CaregiverBaseDto {
  caregiverId: string;
  firstName: string;
  surname: string;
}
