import { DocumentDto } from '../Documents';
import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress';
import { UserDto } from './user.dto';

export interface PrincipalDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  attendanceRegisterLink: string;
  maxChildren?: number;
  consentForPhoto?: boolean;
  parentFees?: number;
  languageUsedInGroups: string;
  startDate?: Date;
  monthSinceFranchisee?: number;
  documents?: DocumentDto[];
}
