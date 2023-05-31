import * as Yup from 'yup';
import { SA_CELL_REGEX } from '@ecdlink/ui';
export interface EditCellphoneModel {
  id?: string;
  userId?: string;
  name?: string;
  surname?: string;
  cellphone?: string;
  whatsapp?: string;
  email?: string;
}

export const initialEditPractitionerValues: EditCellphoneModel = {
  name: '',
  surname: '',
  cellphone: '',
  whatsapp: '',
  email: '',
};

export const editCellphoneNumberSchema = Yup.object().shape({
  name: Yup.string(),
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number'),
  whatsapp: Yup.string().matches(
    SA_CELL_REGEX,
    'Please enter a valid cell number'
  ),
});
