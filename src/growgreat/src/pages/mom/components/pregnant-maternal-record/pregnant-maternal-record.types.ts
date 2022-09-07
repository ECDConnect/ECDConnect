import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';
import { PregnantDetailsModel } from '@/schemas/pregnant/pregnant-details';

export interface PregnantMaternalCaseRecordProps
  extends FormComponentProps<PregnantRegisterModel> {
  deliveryDate?: Date;
  maternalCaseRecord?: string;
  notHaveAMaternalRecord?: false;
  details?: PregnantDetailsModel;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
