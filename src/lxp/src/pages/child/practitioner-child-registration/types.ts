import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';
export interface PractitionerChildRegisterState {
  practitionerId?: string;
  childId?: string;
  childDetails?: ChildBasicInfoModel;
}
