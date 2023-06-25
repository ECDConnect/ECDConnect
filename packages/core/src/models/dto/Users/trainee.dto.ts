import { DocumentDto } from '../Documents';
import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress';
import { UserDto } from './user.dto';

interface PractitionerStartDate {
  startDate?: string;
}

export interface TraineeDto extends EntityBase {
  id?: string;
  startDate?: string;
  traineeConvertedDate?: string;
  consolidationMeetingDate?: string;
  childrenAddedDate?: string;
  linkedPrincipalHierarchy?: string;
  progress?: number;
  programmeType?: string;
  siteVisitsCompleted?: boolean;
  childProgressTraining?: boolean;
  user?: UserDto;
  practitioner?: PractitionerStartDate;
}
