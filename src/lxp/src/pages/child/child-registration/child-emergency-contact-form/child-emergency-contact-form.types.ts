import { FormComponentProps } from '@ecdlink/core';
import { ChildEmergencyContactFormModel } from '@schemas/child/child-registration/child-emergency-contact-form';
import { ChildRegistrationVariation } from '../child-registration-form/child-registration-form.types';

export interface ChildEmergencyContactFormProps
  extends FormComponentProps<ChildEmergencyContactFormModel> {
  enableReadOnlyMode?: boolean;
  childEmergencyContactForm?: ChildEmergencyContactFormModel;
  childName: string;
  variation: ChildRegistrationVariation;
  canEdit?: boolean;
}
