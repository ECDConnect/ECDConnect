import { FormComponentProps } from '@ecdlink/core';
import { ChildRegistrationFormModel } from '@schemas/child/child-registration/child-registration-form';

export type ChildRegistrationVariation = 'caregiver' | 'practitioner';

export interface ChildRegistrationFormProps
  extends FormComponentProps<ChildRegistrationFormModel> {
  childRegisterForm?: ChildRegistrationFormModel;
  variation: ChildRegistrationVariation;
}
