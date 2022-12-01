import { EntityBase } from '../entity-base';
import { UserDto } from './user.dto';
import {} from '../StaticData/education-level.dto';
import { ClinicDto } from './clinic.dto';

export interface TeamLeadDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  jobTitle?: string;
  clinic?: ClinicDto;
  clinicId?: string;
}
