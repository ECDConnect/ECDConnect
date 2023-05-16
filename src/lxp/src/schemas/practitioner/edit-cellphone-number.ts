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

const phoneRegExp = /^((?:\+27|27)|0)(=72|82|73|83|74|84)(\d{7})$/;

export const editCelphoneNumberSchema = Yup.object().shape({
  name: Yup.string(),
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(phoneRegExp, 'Phone number is not valid'),
});
