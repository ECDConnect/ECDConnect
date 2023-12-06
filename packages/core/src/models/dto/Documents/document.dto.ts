import { EntityBase } from '../entity-base';
import { WorkflowStatusDto } from '../StaticData/workflow-status.dto';
import { UserDto } from '../Users/user.dto';
import { DocumentTypeDto } from './document-type.dto';

export interface DocumentDto extends EntityBase {
  userId?: string;
  createdUserId?: string;
  user?: UserDto;
  documentType?: DocumentTypeDto;
  documentTypeId?: string;
  name: string;
  reference?: string;
  workflowStatus?: WorkflowStatusDto;
  workflowStatusId: string;
  file?: string;
  fileName?: string;
  fileType?: string;
  clientName?: string;
  createdByName?: string;
}
