import { FormComponentProps } from '@ecdlink/core';
import { CareGiverReferencePanelFormModel } from '@schemas/child/child-registration/care-giver-reference-panel-form';
import { ChildRegistrationVariation } from '../child-registration-form/child-registration-form.types';

export interface CareGiverReferencePanelFormProps
  extends FormComponentProps<CareGiverReferencePanelFormModel> {
  careGiverReferencePanelForm?: CareGiverReferencePanelFormModel;
  variation?: ChildRegistrationVariation;
  isLoading?: boolean;
}
