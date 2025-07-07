import { FormComponentProps } from '@ecdlink/core';
import { ChildHealthInformationFormModel } from '@schemas/child/child-registration/child-health-information-form';

export interface ChildHealthInformationFormProps
  extends FormComponentProps<ChildHealthInformationFormModel> {
  enableReadOnlyMode?: boolean;
  childHealthInformation?: ChildHealthInformationFormModel;
  childName?: string;
  canEdit?: boolean;
}
