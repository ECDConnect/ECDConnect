import { FormComponentProps } from '@ecdlink/core';
import { InfantRegisterModel } from '@/schemas/infant/infant-register-form';
import { PregnantDetailsModel } from '@/schemas/pregnant/pregnant-details';
import { InfantDetailsModel } from '@/schemas/infant/infant-details';

export interface InfantAddressProps
  extends FormComponentProps<InfantRegisterModel> {
  address?: string;
  details?: PregnantDetailsModel;
  infantDetails?: InfantDetailsModel;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const useMapOrAddressOptions = [
  { text: 'Use map', value: true },
  { text: 'Type in the address', value: false },
];
