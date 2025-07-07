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
  consentForPhoto?: boolean;
  parentFees?: number;
  languageUsedInGroups: string;
  startDate?: Date;
  documents?: DocumentDto[];
  isPrincipal?: boolean;
  signingSignature: string;
  shareInfo?: boolean;
}
