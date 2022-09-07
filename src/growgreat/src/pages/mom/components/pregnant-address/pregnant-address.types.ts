import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';
import { PregnantDetailsModel } from '@/schemas/pregnant/pregnant-details';

export interface PregnantAddressProps
  extends FormComponentProps<PregnantRegisterModel> {
  address?: string;
  details?: PregnantDetailsModel | undefined;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const useMapOrAddressOptions = [
  { text: 'Use map', value: true },
  { text: 'Type in the address', value: false },
];
