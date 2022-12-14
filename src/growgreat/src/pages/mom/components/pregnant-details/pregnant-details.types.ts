import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';

export interface EditPregnantDetailsProps
  extends FormComponentProps<PregnantRegisterModel> {
  name?: string;
  surname?: string;
  age?: string;
  setContactInformation?: any;
  setAddress?: any;
  setIsAlreadyClient?: any;
  isAlreadyClient?: boolean;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
