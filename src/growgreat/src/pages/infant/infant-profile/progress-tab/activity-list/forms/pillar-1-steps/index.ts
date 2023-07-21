import { AlertSeverityType } from '@ecdlink/ui';

export { WeightAndLengthFormStep } from './weight-and-length/form';
export { WeightAndLengthResultStep } from './weight-and-length/result';
export { MidUpperArmCircumferenceResultStep } from './mid-upper-arm-circumference/result';
export { MidUpperArmCircumferenceFormStep } from './mid-upper-arm-circumference/form';
export { InterventionsStep } from './interventions';
export { NutritionStep } from './nutrition';
export { BreastMilkOnlyStep } from './nutrition/breast-milk-only-flow/breast-milk-only';
export { BreastfeedingIssuesStep } from './nutrition/breast-milk-only-flow/breastfeeding-issues';
export { BreastfeedingIssuesRelevantItemsStep } from './nutrition/breast-milk-only-flow/breastfeeding-issues-relevant-items';
export { FormulaMilkNotesStep } from './nutrition/formula-milk-only-flow/formula-milk-notes';
export { BenefitsOfBreastfeedingStep } from './nutrition/formula-milk-only-flow/benefits-of-breastfeeding';
export { BreastfeedingWorksStep } from './nutrition/formula-milk-only-flow/breastfeeding-works';
export { UnsafeFeedingPracticesStep } from './nutrition/formula-milk-only-flow/unsafe-feeding-practices';
export { FoodsFormStep } from './nutrition/mixed-feeding-flow/foods-form';
export { MixedBenefitsOfBreastfeedingStep } from './nutrition/mixed-feeding-flow/benefits-of-breastfeeding';
export { MixedUnsafeFeedingPracticesStep } from './nutrition/mixed-feeding-flow/unsafe-feeding-practices';
export { FirstFoodsStep } from './nutrition/mixed-feeding-flow/first-food';
export { ComplementaryFeedingStep } from './nutrition/mixed-feeding-flow/complementary-feeding';
export { DietFormStep } from './nutrition/complementary-feeding-flow/diet-form';
export { ResourcesStep } from './nutrition/complementary-feeding-flow/resources';

export interface GrowthMonitoring {
  [key: string]: any;
  weight?: {
    value:
      | 'normal'
      | 'severely underweight'
      | 'underweight'
      | 'overweight'
      | 'obese'
      | 'growth faltering';
    statusType: AlertSeverityType;
  };
  length?: {
    value: 'normal' | 'severely stunted' | 'stunted';
    statusType: AlertSeverityType;
  };
  height?: {
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
