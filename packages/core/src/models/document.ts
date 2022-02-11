import { EntityDocumentBase } from './entity-document-extend';

export interface Document extends EntityDocumentBase {
  id?: string;
  userId?: string;
  createdUserId?: string;
  documentTypeId: string;
  name: string;
  reference?: string;
  workflowStatusId: string;
  isActive?: boolean;
}
