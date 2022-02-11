import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress/site-address.dto';
import { EducationLevelDto } from '../StaticData/education-level.dto';
import { GrantDto } from '../StaticData/grant.dto';
import { RelationDto } from '../StaticData/relation.dto';

export interface CaregiverDto extends EntityBase {
  phoneNumber: string;
  idNumber: string;
  firstName: string;
  surname: string;
  fullName?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  relation?: RelationDto;
  relationId?: string;
  education?: EducationLevelDto;
  educationId?: string;
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
