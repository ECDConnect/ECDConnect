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
  shareContactInfo?: boolean;
}

export const initialEditPractitionerValues: EditCellphoneModel = {
  name: '',
  surname: '',
  cellphone: '',
  whatsapp: '',
  email: '',
};

export const editCelphoneNumberSchema = Yup.object().shape({
  name: Yup.string(),
  cellphone: Yup.string()
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number')
    .required('Please enter a cellphone number'),
  whatsapp: Yup.string().matches(
    SA_CELL_REGEX,
    'Please enter a valid cellphone number'
  ),
  email: Yup.string(),
  shareContactInfo: Yup.boolean().required('Please select an option'),
});
