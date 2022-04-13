import { EntityStaticBase } from '../entity-static-base';

export interface WorkflowStatusDto extends EntityStaticBase {
  description: string;
  workflowStatusTypeId?: string;
  workflowStatusType?: WorkflowStatusTypeDto;
}

export interface WorkflowStatusTypeDto extends EntityStaticBase {
  description: string;
}
