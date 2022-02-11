import { FormComponentProps } from '@ecdlink/core';
import { CareGiverExtraInformationFormModel } from '../../../../schemas/child/child-registration/care-giver-extra-information';

export interface CareGiverExtraInformationFormProps
  extends FormComponentProps<CareGiverExtraInformationFormModel> {
  careGiverExtraInformation?: CareGiverExtraInformationFormModel;
}
