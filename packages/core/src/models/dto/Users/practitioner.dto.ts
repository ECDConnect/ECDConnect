import { DocumentDto } from '../Documents';
import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress';
import { AbsenteeDto } from './absentee.dto';
import { UserDto } from './user.dto';

export interface PractitionerDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  firstName?: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  attendanceRegisterLink?: string;
  consentForPhoto?: boolean;
  parentFees?: number;
  languageUsedInGroups?: string;
  startDate?: Date;
  documents?: DocumentDto[];
  isPrincipal?: boolean;
  principalHierarchy?: string;
  principalName?: string;
  principalProfilePic?: string;
  signingSignature?: string;
  coachHierarchy?: string;
  coachName?: string;
  coachProfilePic?: string;
  shareInfo?: boolean;
  isRegistered?: boolean;
  dateLinked?: Date;
  dateAccepted?: Date;
  dateToBeRemoved?: Date;
  isLeaving?: boolean;
  programmeType?: string;
  progress?: number;
  usePhotoInReport?: string;
  isCompletedBusinessWalkThrough?: boolean;
  absentees?: AbsenteeDto[];
  daysAbsentLastMonth?: number | string;
  permissions?: UserPermissionDto[];
  communitySectionViewDate?: string;
  clickedCommunityTab?: boolean;
  progressWalkthroughComplete?: boolean;
}

export interface UserPermissionDto {
  id: string;
  userId: string;
  permissionId: string;
  isActive: boolean;
  permissionName: string;
  permissionNormalizedName: string;
  permissionGrouping: string;
}

export interface PractitionerStatsDto {
  schoolName: string;
  totalPractitionersForSchool: number;
  totalChildrenForSchool: number;
  totalClassesForSchool: number;
  totalAttendanceRegistersCompleted: number;
  totalAttendanceRegistersNotCompleted: number;
  totalProgressReportsCompleted: number;
  totalProgressReportsNotCompleted: number;
  totalIncomeStatementsDownloaded: number;
  totalIncomeStatementsWithNoItems: number;
}
