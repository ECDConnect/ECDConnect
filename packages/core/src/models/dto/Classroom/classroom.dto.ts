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
  isPrincipal: boolean | null;
  numberPractitioners: number | null;
  numberOfAssistants: number | null;
  numberOfOtherAssistants: number | null;
  doesOwnerTeach: boolean | null;
  attendance?: AttendanceDto[];
  classroomImageUrl?: string;
}
