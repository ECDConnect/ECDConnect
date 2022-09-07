import { FormComponentProps } from '@ecdlink/core';
import { InfantRoadToHealthModel } from '@/schemas/infant/infant-road-to-health';

export interface PregnantMaternalCaseRecordProps
  extends FormComponentProps<InfantRoadToHealthModel> {
  weightAtBirth?: number;
  lengthAtBirth?: number;
  roadToHealthBook?: string;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
