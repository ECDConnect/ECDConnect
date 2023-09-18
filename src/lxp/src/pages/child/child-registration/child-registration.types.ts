import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';

export enum ChildRegistrationSteps {
  registrationForm = 1,
  childInformationForm = 2,
  childExtraInformationForm = 3,
  childHealthInformationForm = 4,
  childBirthCertificateForm = 5,
  childCareGiverInformationForm = 6,
  childCareGiverChildInformationForm = 7,
  childCareGiverExtraInformationForm = 8,
  childCareGiverContributionForm = 9,
  childEmergencyContactForm = 10,
  careGiverReferencePanelForm = 11,
}

export interface ChildRegistrationRouteState {
  step?: ChildRegistrationSteps;
  childId?: string;
  childDetails?: ChildBasicInfoModel;
  practitionerId?: string;
}
