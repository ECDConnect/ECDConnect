import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';

export enum ChildRegistrationSteps {
  registrationForm = 1,
  childInformationForm = 2,
  childExtraInformationForm = 3,
  childHealthInformationForm = 4,
  childBirthCertificateForm = 50,
  childCareGiverInformationForm = 5,
  childCareGiverChildInformationForm = 6,
  childCareGiverExtraInformationForm = 7,
  childCareGiverContributionForm = 80,
  childEmergencyContactForm = 8,
  careGiverReferencePanelForm = 9,
}

export interface ChildRegistrationRouteState {
  step?: ChildRegistrationSteps;
  childId?: string;
  childDetails?: ChildBasicInfoModel;
  practitionerId?: string;
  notificationReference?: string;
}
