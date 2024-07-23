import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress';
import { UserDto } from '../Users/user.dto';
import { AttendanceDto } from './attendance.dto';
import { ClassroomGroupDto } from './classroom-group.dto';

export interface ClassroomDto extends EntityBase {
  classroomOwner?: UserDto;
  userId: string;
  siteAddressId?: string;
  siteAddress?: SiteAddressDto;
  classroomGroups?: ClassroomGroupDto[];
  name: string;
  isPrinciple: boolean | null;
  numberPractitioners: number | null;
  numberOfOtherAssistants: number | null;
  // numberOfAssistants: number | null;
  // doesOwnerTeach: boolean | null;
  attendance?: AttendanceDto[];
  classroomImageUrl?: string;
  classroomId?: string;
  classSiteAddress?: string;
  isDummySchool?: boolean;
}
