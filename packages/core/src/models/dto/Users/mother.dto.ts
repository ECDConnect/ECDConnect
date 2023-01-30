import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress/site-address.dto';
import { UserDto } from './user.dto';
import {} from '../StaticData/education-level.dto';
import { DocumentDto } from '../Documents/document.dto';
import { HealthCareWorkerDto } from './health-care-worker.dto';

export interface MotherDto extends EntityBase {
  user?: UserDto;
  firstName?: string;
  surname?: string;
  userId?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  healthCareWorker?: HealthCareWorkerDto;
  healthCareWorkerId?: string;
  documents?: string;
  age?: string;
  expectedDateOfDelivery?: Date | string;
  phoneNumber?: string;
  whatsAppNumber?: string;
  nextVisitDate?: string;
  statusInfo?: {
    icon?: string;
    color?: string;
    notes?: string;
    subject?: string;
  };
}
