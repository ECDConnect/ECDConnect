import { DocumentDto } from '../Documents';
import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress';
import { UserDto } from './user.dto';

export interface PractitionerDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  attendanceRegisterLink?: string;
  maxChildren?: number;
  consentForPhoto?: boolean;
  parentFees?: number;
  languageUsedInGroups?: string;
  startDate?: Date;
  monthSinceFranchisee?: number;
  documents?: DocumentDto[];
  isPrincipal?: boolean;
  isFundaAppAdmin?: boolean;
  isTrainee?: boolean;
  principalHierarchy?: string;
  signingSignature?: string;
  coachHierarchy?: string;
  shareInfo?: boolean;
  isRegistered?: boolean;
}
