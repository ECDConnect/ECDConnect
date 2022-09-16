import { FormComponentProps } from '@ecdlink/core';
import { InfantRegisterModel } from '@/schemas/infant/infant-register-form';
import { PregnantDetailsModel } from '@/schemas/pregnant/pregnant-details';

export interface InfantAddressProps
  extends FormComponentProps<InfantRegisterModel> {
  address?: string;
  details?: PregnantDetailsModel;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const useMapOrAddressOptions = [
  { text: 'Use map', value: true },
  { text: 'Type in the address', value: false },
];
