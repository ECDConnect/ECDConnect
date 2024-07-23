import { FormComponentProps } from '@ecdlink/core';
import { InfantRoadToHealthModel } from '@/schemas/infant/infant-road-to-health';
import { InfantDetailsModel } from '@/schemas/infant/infant-details';

export interface PregnantMaternalCaseRecordProps
  extends FormComponentProps<InfantRoadToHealthModel> {
  infantDetails?: InfantDetailsModel;
  weightAtBirth?: number;
  lengthAtBirth?: number;
  roadToHealthBook?: string;
  isFromClientProfile?: boolean;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
