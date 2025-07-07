import { FormComponentProps } from '@ecdlink/core';
import { ChildInformationFormModel } from '@schemas/child/child-registration/child-information-form';
import { ChildRegistrationVariation } from '../child-registration-form/child-registration-form.types';

export interface ChildInformationFormProps
  extends FormComponentProps<ChildInformationFormModel> {
  childInformation?: ChildInformationFormModel;
  variation: ChildRegistrationVariation;
}
