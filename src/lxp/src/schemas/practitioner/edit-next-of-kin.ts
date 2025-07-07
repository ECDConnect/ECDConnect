import * as Yup from 'yup';
import { SA_CELL_REGEX } from '@ecdlink/ui';
export interface EditNextOfKinModel {
  id?: string;
  userId?: string;
  name?: string;
  surname?: string;
  cellphone?: string;
}

export const initialEditPractitionerValues: EditNextOfKinModel = {
  name: '',
  surname: '',
  cellphone: '',
};

export const editNextOfKinSchema = Yup.object().shape({
  name: Yup.string(),
  cellphone: Yup.string()
    .required('Phone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number'),
});
