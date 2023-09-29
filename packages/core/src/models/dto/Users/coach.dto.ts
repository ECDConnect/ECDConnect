import { FranchisorDto } from './franchisor.dto';
import { SiteAddressDto } from '../SiteAddress';
import { EntityBase } from '../entity-base';
import { UserDto } from './user.dto';

export interface CoachDto extends EntityBase {
  clickedClubTab?: boolean;
  user?: UserDto;
  userId?: string;
  areaOfOperation: string;
  secondaryAreaOfOperation: string;
  startDate?: Date;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  signingSignature?: string;
  franchisorId?: string;
  franchisor?: FranchisorDto;
}
