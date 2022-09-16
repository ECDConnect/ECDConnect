import { FormComponentProps } from '@ecdlink/core';
import { MothertContactInformationModel } from '@/schemas/infant/mother-contact-information';
import { MotherDetailsModel } from '@/schemas/infant/mother-details';

export interface MotherContactInformationProps
  extends FormComponentProps<MothertContactInformationModel> {
  cellphone?: string;
  whatsapp?: string;
  details?: MotherDetailsModel;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
