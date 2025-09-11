import { DocumentDto } from '../Documents/document.dto';
import { EntityBase } from '../entity-base';
import { WorkflowStatusDto } from '../StaticData/workflow-status.dto';
import { CaregiverDto } from './care-giver.dto';
import { UserDto } from './user.dto';

export interface ChildDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  caregiverId?: string;
  caregiver?: CaregiverDto;
  allergies?: string;
  disabilities?: string;
  otherHealthConditions?: string;
  documents?: DocumentDto[];
  workflowStatus?: WorkflowStatusDto;
  workflowStatusId?: string;
  insertedBy?: string;
  isOnline?: boolean;
  reasonForLeavingId?: string;
  inactiveDate?: Date;
  inactivityComments?: string;
  otherLanguages?: string;
  homeLanguageIds?: string[];
}

export interface AddChildTokenDto {
  token: string;
  childId: string;
}
