import { AlertSeverityType } from '@ecdlink/ui';

export { WeightAndLengthResultStep } from './weight-and-length/result';
export { MaternalDistressScreenStep } from './maternal-distress/result';
export { MaternalDistressVideoStep } from './maternal-distress/form';
export { DrugOrAlcoholUseStep } from './drug-or-alcohol-use';
export { NutritionStep } from './nutrition';
export { AlcoholUseStep } from './nutrition/complementary-feeding-flow/alcohol-use';
export { HivCareAndMedicationStep } from './nutrition/complementary-feeding-flow/hiv-care';
export { MaternalDistressFollowUpStep } from './maternal-distress/result/follow-up';
export { BirthPreparationStep } from './birth-preparation';

export interface GrowthMonitoring {
  [key: string]: any;
  weight?: {
    value:
      | 'normal'
      | 'severely underweight'
      | 'underweight'
      | 'overweight'
      | 'obese';
    statusType: AlertSeverityType;
  };
  length?: {
    value: 'normal' | 'severely stunted' | 'stunted';
    statusType: AlertSeverityType;
  };
  muac?: {
    value:
      | 'normal'
      | 'severe acute malnutrition'
      | 'moderate acute malnutrition';
    statusType: AlertSeverityType;
  };
}
