import { FormComponentProps } from '@ecdlink/core';
import { InfantRegisterModel } from '@/schemas/infant/infant-register-form';

export interface EditInfantDetailsProps
  extends FormComponentProps<InfantRegisterModel> {
  name?: string;
  dateOfBirth?: Date;
  genderId?: string;
  numberOfChildren?: number;
  multipleChildrenCount?: number;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export const genderOptions = [
  { text: 'Female', value: '1' },
  { text: 'Male', value: '2' },
];
