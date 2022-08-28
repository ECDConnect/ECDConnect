import { DocumentDto } from '../Documents';
import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress';
import { CoachDto } from './coach.dto';
import { UserDto } from './user.dto';

export interface PractitionerDto extends EntityBase {
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
  isPrincipal?: boolean;
  isFundaAppAdmin?: boolean;
  isTrainee?: boolean;
  signingSignature: string;
  coachHierarchy: string;
  coach?: CoachDto;
  principalHierarchy: string;
  principal?: PractitionerDto;
}
