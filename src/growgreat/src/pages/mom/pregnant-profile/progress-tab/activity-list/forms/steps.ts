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
  MaternalDistressVideoStep,
  MaternalDistressScreenStep,
  MaternalDistressFollowUpStep,
  DrugOrAlcoholUseStep,
  AlcoholUseStep,
  HivCareAndMedicationStep,
  BirthPreparationStep,
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

export const getHealhcareteps = ({
  isAntenatalClinicStep,
  isDangerSignsFollowUp,
  isFirstVisit,
}: {
  isDangerSignsFollowUp: boolean;
  isFirstVisit: boolean;
  isAntenatalClinicStep: boolean;
}) => [
  AntenatalCare,
  ...(isAntenatalClinicStep ? [ClinicVisitsStep] : []),
  ...(isDangerSignsFollowUp ? [HealthcareDangerSignsFollowUpStep] : []),
  ...(isFirstVisit ? [] : [ClinicVisitsUpToDateStep]),
  AntenatalClinicVideoStep,
];

export const careForBabySteps = (
  isDangerSignsFollowUp: boolean,
  isMUACStep: boolean
) => [
  ...(isMUACStep ? [MotherGrowthMUACStep] : []),
  NutritonEatingStep,
  ...(isDangerSignsFollowUp ? [BabyDangerSignsFollowUpStep] : []),
  HealthyEatingStep,
];

export const getPregnancyCareSteps = (
  isEqualOrAfter98andEqualOrBefore168Days: boolean,
  isAlcoholUseStep: boolean,
  isIDDocumentStep: boolean,
  isMaternalDistressFollowUp: boolean,
  isMaternalDistress: boolean,
  isHIVCareStep: boolean,
  isEqualOrAfter196Days: boolean
) => {
  const defaultScreens = [
    WeightAndLengthResultStep,
    MaternalDistressVideoStep,
    ...(isMaternalDistressFollowUp ? [MaternalDistressFollowUpStep] : []),
    ...(isMaternalDistress ? [MaternalDistressScreenStep] : []),
    ...(isEqualOrAfter98andEqualOrBefore168Days ? [DrugOrAlcoholUseStep] : []),
  ];

  const complementaryFeedingFlow = [
    ...(isAlcoholUseStep ? [AlcoholUseStep] : []),
    ...(isHIVCareStep ? [HivCareAndMedicationStep] : []),
    ...(isIDDocumentStep ? [IdDocumentStep] : []),
    ...(isEqualOrAfter98andEqualOrBefore168Days || isEqualOrAfter196Days
      ? [BirthPreparationStep]
      : []),
    ...(isEqualOrAfter98andEqualOrBefore168Days ? [InfantCareStep] : []),
  ];

  return [...defaultScreens, ...complementaryFeedingFlow];
};

export const dangerSignsSteps = (
  isDangerSignsFollowUpStep: boolean,
  isFirstVisit: boolean
) => [
  ...(isDangerSignsFollowUpStep ? [DangerSignsFollowUpStep] : []),
  ...(isFirstVisit ? [] : [DangerSignsStep]),
];

export const followUpSteps = (isReferralsStep: boolean) => [
  NotesStep,
  ...(isReferralsStep ? [ReferralsStep] : []),
  ProgressStep,
  NextVisitStep,
];
