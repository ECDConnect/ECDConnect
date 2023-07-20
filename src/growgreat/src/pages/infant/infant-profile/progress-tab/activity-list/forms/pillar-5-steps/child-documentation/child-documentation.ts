import { SA_ID_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ChildDocumentationModel {
  idNumber: string;
}

export const initialChildDocumentationModelValues: ChildDocumentationModel = {
  idNumber: '',
};

export const childDocumentationModelSchema = Yup.object().shape({
  idNumber: Yup.string().matches(SA_ID_REGEX, 'Please enter a ID number'),
});
