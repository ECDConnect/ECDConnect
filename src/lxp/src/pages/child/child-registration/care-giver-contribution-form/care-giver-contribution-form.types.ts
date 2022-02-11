import { FormComponentProps } from '@ecdlink/core';
import { CareGiverContributionFormModel } from '../../../../schemas/child/child-registration/care-giver-contribution-form';
import { ChildRegistrationDetails } from '../../caregiver-child-registration/caregiver-child-registration.types';
import { ChildRegistrationVariation } from '../child-registration-form/child-registration-form.types';

export interface CareGiverContributionFormProps
  extends FormComponentProps<CareGiverContributionFormModel> {
  careGiverContributionForm?: CareGiverContributionFormModel;
  variation?: ChildRegistrationVariation;
  childDetails?: ChildRegistrationDetails;
}
