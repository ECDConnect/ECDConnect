import { SiteAddressDto } from '../SiteAddress';
import { EntityBase } from '../entity-base';
import { UserDto } from './user.dto';

export interface CoachDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  areaOfOperation: string;
  secondaryAreaOfOperation: string;
  startDate?: Date;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  signingSignature?: string;
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
