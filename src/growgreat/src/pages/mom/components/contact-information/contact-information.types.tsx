import { FormComponentProps } from '@ecdlink/core';
import { PregnantContactInformationModel } from '@/schemas/pregnant/pregnant-contact-information';
import { PregnantDetailsModel } from '@/schemas/pregnant/pregnant-details';

export interface EditPregnantContactInformationProps
  extends FormComponentProps<PregnantContactInformationModel> {
  cellphone?: string;
  whatsapp?: string;
  details?: PregnantDetailsModel;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
