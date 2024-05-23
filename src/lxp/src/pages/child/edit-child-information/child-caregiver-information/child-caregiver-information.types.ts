import { FormComponentProps } from '@ecdlink/core';
import { ChildCaregiverInformationModel } from '@schemas/child/edit-child-information/care-giver-information-form';

export interface ChildCaregiverInformationProps
  extends FormComponentProps<ChildCaregiverInformationModel> {
  enableReadOnlyMode?: boolean;
  childCareGiverInformation?: ChildCaregiverInformationModel;
  childName: string;
  canEdit?: boolean;
}
