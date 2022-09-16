export interface EditChildInformationLocationParams {
  childId: string;
  playgroupEdit?: boolean;
}

export type ChildInformationViewType =
  | 'address'
  | 'healthInformation'
  | 'caregiverInformation'
  | 'emergencyContact';
