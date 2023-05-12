import * as Yup from 'yup';
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const editCelphoneNumberSchema = Yup.object().shape({
  name: Yup.string(),
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'too short')
    .max(10, 'too long'),
});
