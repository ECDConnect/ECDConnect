import {
  ClinicVisitsStep,
  DangerSignsFollowUpStep as HealthcareDangerSignsFollowUpStep,
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
  MaternalDistressFollowUpStep,
  DrugOrAlcoholUseStep,
  AlcoholUseStep,
  HivCareAndMedicationStep,
} from './pregnancy-care-steps';
import { DangerSignsStep, DangerSignsFollowUpStep } from './danger-signs-steps';
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
  ...(isDangerSignsFollowUp ? [HealthcareDangerSignsFollowUpStep] : []),
  ClinicVisitsUpToDateStep,
  AntenatalClinicVideoStep,
];

export const careForBabySteps = (isDangerSignsFollowUp: boolean) => [
  MotherGrowthMUACStep,
  NutritonEatingStep,
  ...(isDangerSignsFollowUp ? [BabyDangerSignsFollowUpStep] : []),
  HealthyEatingStep,
];

export const getPregnancyCareSteps = (
  isEqualOrAfter98andEqualOrBefore168Days: boolean,
  isAlcoholUseStep: boolean,
  isIDDocumentStep: boolean,
  isMaternalDistressFollowUp: boolean
) => {
  const defaultScreens = [
    WeightAndLengthResultStep,
    MaternalDistressSteps,
    ...(isMaternalDistressFollowUp ? [MaternalDistressFollowUpStep] : []),
    MidUpperArmCircumferenceResultStep,
    ...(isEqualOrAfter98andEqualOrBefore168Days ? [DrugOrAlcoholUseStep] : []),
  ];

  const complementaryFeedingFlow = [
    ...(isAlcoholUseStep ? [AlcoholUseStep] : []),
    HivCareAndMedicationStep,
    ...(isIDDocumentStep ? [IdDocumentStep] : []),
    ...(isEqualOrAfter98andEqualOrBefore168Days ? [InfantCareStep] : []),
  ];

  return [...defaultScreens, ...complementaryFeedingFlow];
};

export const dangerSignsSteps = (isDangerSignsFollowUpStep: boolean) => [
  ...(isDangerSignsFollowUpStep ? [DangerSignsFollowUpStep] : []),
  DangerSignsStep,
];

export const followUpSteps = (isReferralsStep: boolean) => [
  NotesStep,
  ...(isReferralsStep ? [ReferralsStep] : []),
  ProgressStep,
  NextVisitStep,
];
