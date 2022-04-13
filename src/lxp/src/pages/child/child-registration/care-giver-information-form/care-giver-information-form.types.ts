import { FormComponentProps } from '@ecdlink/core';
import { CareGiverInformationFormModel } from '@schemas/child/child-registration/care-giver-information-form';

export interface CareGiverInformationFormProps
  extends FormComponentProps<CareGiverInformationFormModel> {
  careGiverInformation?: CareGiverInformationFormModel;
  childName: string;
}
