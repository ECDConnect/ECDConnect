import * as Yup from 'yup';
import { SA_CELL_REGEX } from '@ecdlink/ui';
export interface EditPractitionerModel {
  id?: string;
  userId?: string;
  firstName: string;
  surname: string;
  cellphone?: string;
  whatsapp?: string;
}

export const initialEditPractitionerValues: EditPractitionerModel = {
  firstName: '',
  surname: '',
  cellphone: '',
  whatsapp: '',
};

export const editPractitionerSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  surname: Yup.string().required(),
  cellphone: Yup.string().matches(
    SA_CELL_REGEX,
    'Please enter a valid cellphone number'
  ),
  whatsapp: Yup.string().matches(
    SA_CELL_REGEX,
    'Please enter a valid cellphone number'
  ),
});
