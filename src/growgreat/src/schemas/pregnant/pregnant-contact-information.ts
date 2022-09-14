import * as Yup from 'yup';

export interface PregnantContactInformationModel {
  cellphone: string;
  whatsapp: string;
}

export const initialPregnantContactInformationValues: PregnantContactInformationModel =
  {
    cellphone: '',
    whatsapp: '',
  };

export const pregnantContactInformationModelSchema = Yup.object().shape({
  cellphone: Yup.string().required('Cellphone number is required'),
  whatsapp: Yup.string(),
});
