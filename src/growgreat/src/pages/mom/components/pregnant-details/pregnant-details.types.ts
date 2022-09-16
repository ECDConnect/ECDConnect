import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';

export interface EditPregnantDetailsProps
  extends FormComponentProps<PregnantRegisterModel> {
  name?: string | undefined;
  surname?: string | undefined;
  age?: string | undefined;
  setContactInformation?: any | undefined;
  setAddress?: any | undefined;
  setIsAlreadyClient?: any | undefined;
  isAlreadyClient?: boolean | undefined;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
