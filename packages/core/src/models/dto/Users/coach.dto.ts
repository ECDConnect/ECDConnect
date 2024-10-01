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

export interface CoachStatsDto {
  totalPractitioners: number;
  totalNewPractitioners: number;
  totalSiteVisits: number;
  totalWithNoIncomeExpense: number;
  totalWithIncomeExpense: number;
  totalLessThan75AttendanceRegisters: number;
  totalMoreThan75hAttendanceRegisters: number;
  totalWithNoProgressReports: number;
  totalWithProgressReports: number;
}
