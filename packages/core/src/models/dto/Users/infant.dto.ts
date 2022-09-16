import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress/site-address.dto';
import { UserDto } from './user.dto';
import {} from '../StaticData/education-level.dto';
import { DocumentDto } from '../Documents/document.dto';
import { CaregiverDto } from './care-giver.dto';
import { LanguageDto } from '../StaticData/language.dto';
import { HealthCareWorkerDto } from './health-care-worker.dto';

export interface InfantDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  caregiverId?: string;
  caregiver?: CaregiverDto;
  siteAddress?: string;
  siteAddressId?: string;
  healthCareWorker?: HealthCareWorkerDto;
  healthCareWorkerId?: string;
  documents?: string;
  dateOfBirth?: Date | string;
  firstName?: string;
  genderId?: string;
  weightAtBirth?: number;
  lengthAtBirth?: number;
}
