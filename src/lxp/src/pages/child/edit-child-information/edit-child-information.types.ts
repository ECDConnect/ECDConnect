export interface EditChildInformationLocationParams {
  childId: string;
}

export type ChildInformationViewType =
  | 'address'
  | 'healthInformation'
  | 'caregiverInformation'
  | 'emergencyContact';
