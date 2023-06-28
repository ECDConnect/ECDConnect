import * as Yup from 'yup';

export interface MothertContactInformationModel {
  cellphone?: string;
  whatsapp?: string;
}

export const initialMothertContactInformationValues: MothertContactInformationModel =
  {
    cellphone: '',
    whatsapp: '',
  };

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const motherContactInformationModelSchema = Yup.object().shape({
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'too short')
    .max(10, 'too long'),
  whatsapp: Yup.string()
    .required('Cellphone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'too short')
    .max(10, 'too long'),
});
