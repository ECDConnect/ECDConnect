import {
  ClinicVisitsStep,
  ExpectedDeliveryStep,
  DangerSignsFollowUpStep,
  ClinicVisitsUpToDateStep,
  AntenatalClinicVideoStep,
  AntenatalCare,
} from './healthcare-steps';
import {
  MotherGrowthMUACStep,
  NutritonEatingStep,
  DangerSignsFollowUpStep as BabyDangerSignsFollowUpStep,
  HealthyEatingStep,
} from './nutrition-steps';
import {
  WeightAndLengthResultStep,
  MaternalDistressSteps,
  MidUpperArmCircumferenceResultStep,
  DrugOrAlcoholUseStep,
  AlcoholUseStep,
  HivCareAndMedicationStep,
} from './pregnancy-care-steps';
import { DangerSignsStep } from './danger-signs-steps';
import {
  NotesStep,
  ReferralsStep,
  ProgressStep,
  NextVisitStep,
} from './follow-up-steps';

import { IdDocumentStep } from './pregnancy-care-steps/nutrition/complementary-feeding-flow/id-document';
import { InfantCareStep } from './pregnancy-care-steps/nutrition/complementary-feeding-flow/infant-care';

export const getHealhcareteps = (isDangerSignsFollowUp: boolean) => [
  AntenatalCare,
  ClinicVisitsStep,
  ...(isDangerSignsFollowUp ? [DangerSignsFollowUpStep] : []),
  ExpectedDeliveryStep,
  ClinicVisitsUpToDateStep,
  AntenatalClinicVideoStep,
];

export const careForBabySteps = (isDangerSignsFollowUp: boolean) => [
  MotherGrowthMUACStep,
  NutritonEatingStep,
  ...(isDangerSignsFollowUp ? [BabyDangerSignsFollowUpStep] : []),
  HealthyEatingStep,
];

export const getPillar1Steps = () => {
  const defaultScreens = [
    WeightAndLengthResultStep,
    MaternalDistressSteps,
    MidUpperArmCircumferenceResultStep,
    DrugOrAlcoholUseStep,
  ];

  const complementaryFeedingFlow = [
    AlcoholUseStep,
    HivCareAndMedicationStep,
    IdDocumentStep,
    InfantCareStep,
  ];

  return [...defaultScreens, ...complementaryFeedingFlow];
};

export const dangerSignsSteps = (
  isDevelopmentalScreeningWeeksFollowUp: boolean
) => [DangerSignsStep];

export const followUpSteps = (isReferralsStep: boolean) => [
  NotesStep,
  ...(isReferralsStep ? [ReferralsStep] : []),
  ProgressStep,
  NextVisitStep,
];
