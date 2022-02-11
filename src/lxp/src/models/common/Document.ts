import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';

export interface CreateDocumentRquest {
  fileName: string;
  fileType: FileTypeEnum;
  data: string;
  userId: string;
  status?: WorkflowStatusEnum;
}
