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

export const motherContactInformationModelSchema = Yup.object().shape({
  cellphone: Yup.string().required('Cellphone number is required'),
  whatsapp: Yup.string(),
});
