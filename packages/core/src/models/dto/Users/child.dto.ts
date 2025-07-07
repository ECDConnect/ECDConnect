import { DocumentDto } from '../Documents/document.dto';
import { EntityBase } from '../entity-base';
import { LanguageDto } from '../StaticData/language.dto';
import { WorkflowStatusDto } from '../StaticData/workflow-status.dto';
import { CaregiverDto } from './care-giver.dto';
import { UserDto } from './user.dto';

export interface ChildDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  caregiverId?: string;
  caregiver?: CaregiverDto;
  language?: LanguageDto;
  languageId?: string;
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
}

export interface AddChildTokenDto {
  token: string;
  childId: string;
}
