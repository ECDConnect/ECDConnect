import { SA_CELL_REGEX } from '@ecdlink/ui';
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
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cell number'),
  whatsapp: Yup.string()
    .nullable(true)
    .matches(SA_CELL_REGEX, {
      message: 'Please enter a valid cell number',
      excludeEmptyString: true,
    }),
});
