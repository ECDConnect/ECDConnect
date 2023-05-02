export interface EditChildInformationLocationParams {
  childId: string;
  playgroupEdit?: boolean;
  isFromEditClass?: boolean;
}

export type ChildInformationViewType =
  | 'address'
  | 'healthInformation'
  | 'caregiverInformation'
  | 'emergencyContact';
