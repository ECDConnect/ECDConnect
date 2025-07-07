import { FormComponentProps } from '@ecdlink/core';
import { CareGiverChildInformationFormModel } from '@schemas/child/child-registration/care-giver-child-information-form';

export interface CareGiverChildInformationFormProps
  extends FormComponentProps<CareGiverChildInformationFormModel> {
  enableReadOnlyMode?: boolean;
  careGiverInformation?: CareGiverChildInformationFormModel;
  canEdit?: boolean;
}
