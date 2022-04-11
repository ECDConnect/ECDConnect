import * as Yup from 'yup';
import { Document } from '../models/document';

export const initialDocumentValues: Document = {
  name: '',
  workflowStatusId: '',
  fileType: undefined,
  documentTypeId: '',
};

export const documentSchema = Yup.object().shape({
  name: Yup.string(),
  workflowStatusId: Yup.string(),
});
