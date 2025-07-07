import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';

export interface CreateDocumentRequest {
  fileName: string;
  fileType: FileTypeEnum;
  data: string;
  userId: string;
  status?: WorkflowStatusEnum;
}
