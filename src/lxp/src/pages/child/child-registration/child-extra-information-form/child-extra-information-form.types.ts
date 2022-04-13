import { FormComponentProps } from '@ecdlink/core';
import { ChildExtraInformationFormModel } from '@schemas/child/child-registration/child-extra-information-form';

export interface ChildExtraInformationFormProps
  extends FormComponentProps<ChildExtraInformationFormModel> {
  childExtraInformation?: ChildExtraInformationFormModel;
  childName: string;
}
