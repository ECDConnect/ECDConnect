import {
  ClinicVisitsStep,
  ExpectedDeliveryStep,
  DangerSignsFollowUpStep,
  ClinicVisitsUpToDateStep,
  AntenatalClinicVideoStep,
  // MaternalDistressStep,
  // MaternalDistressScreeningStep,
  AntenatalCare,
} from './healthcare-steps';
import {
  MotherGrowthMUACStep,
  NutritonEatingStep,
  DangerSignsStep as BabyDangerSignsStep,
  DangerSignsFollowUpStep as BabyDangerSignsFollowUpStep,
  HealthyEatingStep,
} from './nutrition-steps';
import {
  WeightAndLengthFormStep,
  WeightAndLengthResultStep,
  MaternalDistressSteps,
  MidUpperArmCircumferenceResultStep,
  DrugOrAlcoholUseStep,
  NutritionStep,
  BreastMilkOnlyStep,
  BreastfeedingIssuesStep,
  BreastfeedingIssuesRelevantItemsStep,
  FormulaMilkNotesStep,
  BenefitsOfBreastfeedingStep,
  BreastfeedingWorksStep,
  UnsafeFeedingPracticesStep,
  FoodsFormStep,
  MixedBenefitsOfBreastfeedingStep,
  MixedBreastfeedingWorksStep,
  MixedUnsafeFeedingPracticesStep,
  FirstFoodsStep,
  ComplementaryFeedingStep,
  AlcoholUseStep,
  HivCareAndMedicationStep,
} from './pregnancy-care-steps';
import {
  DevelopmentalScreeningStep,
  DevelopmentalScreeningWeeksStep,
  DevelopmentalScreeningWeeksFollowUpStep,
  DangerSignsStep,
} from './danger-signs-steps';
import {
  NotesStep,
  ReferralsStep,
  ProgressStep,
  NextVisitStep,
} from './follow-up-steps';

import { nutritionAnswers } from './pregnancy-care-steps/nutrition';
import { Question } from './dynamic-form';
import { IdDocumentStep } from './pregnancy-care-steps/nutrition/complementary-feeding-flow/id-document';
import { InfantCareStep } from './pregnancy-care-steps/nutrition/complementary-feeding-flow/infant-care';

export const getHealhcareteps = (isDangerSignsFollowUp: boolean) => [
  AntenatalCare,
  ClinicVisitsStep,
  ...(isDangerSignsFollowUp ? [DangerSignsFollowUpStep] : []),
  ExpectedDeliveryStep,
  ClinicVisitsUpToDateStep,
  AntenatalClinicVideoStep,
  // MaternalDistressStep,
  // MaternalDistressScreeningStep,
];

export const careForBabySteps = (isDangerSignsFollowUp: boolean) => [
  MotherGrowthMUACStep,
  NutritonEatingStep,
  ...(isDangerSignsFollowUp ? [BabyDangerSignsFollowUpStep] : []),
  HealthyEatingStep,
];

export const getPillar1Steps = ({
  nutritionAnswer,
  isToSkipBreastfeedingIssuesRelevantItemsStep,
  isShowNutritionStep,
  isFormulaMilkHowBreastfeedingWorks,
  isFormulaMilkUnsafeFeedingPractices,
  isMixedFeedingFoodsForm,
  isMixedFeedingBenefitsOfBreastfeeding,
  isMixedFeedingHowBreastfeedingWorks,
  isMixedFeedingUnsafeFeedingPractices,
  isMixedFeedingFistFoods,
  isMixedFeedingComplementaryFeeding,
}: {
  nutritionAnswer: Question['answer'];
  isToSkipBreastfeedingIssuesRelevantItemsStep: boolean;
  isShowNutritionStep: boolean;
  isFormulaMilkHowBreastfeedingWorks: boolean;
  isFormulaMilkUnsafeFeedingPractices: boolean;
  isMixedFeedingFoodsForm: boolean;
  isMixedFeedingBenefitsOfBreastfeeding: boolean;
  isMixedFeedingHowBreastfeedingWorks: boolean;
  isMixedFeedingUnsafeFeedingPractices: boolean;
  isMixedFeedingFistFoods: boolean;
  isMixedFeedingComplementaryFeeding: boolean;
}) => {
  const defaultScreens = [
    WeightAndLengthResultStep,
    MaternalDistressSteps,
    MidUpperArmCircumferenceResultStep,
    DrugOrAlcoholUseStep,
    ...(isShowNutritionStep ? [NutritionStep] : []),
  ];

  const breastMilkOnlyFlow = [
    BreastMilkOnlyStep,
    BreastfeedingIssuesStep,
    ...(isToSkipBreastfeedingIssuesRelevantItemsStep
      ? []
      : [BreastfeedingIssuesRelevantItemsStep]),
  ];

  const formulaMilkOnlyFlow = [
    FormulaMilkNotesStep,
    BenefitsOfBreastfeedingStep,
    ...(isFormulaMilkHowBreastfeedingWorks ? [BreastfeedingWorksStep] : []),
    ...(isFormulaMilkUnsafeFeedingPractices
      ? [UnsafeFeedingPracticesStep]
      : []),
  ];

  const mixedFeedingFlow = [
    ...(isMixedFeedingFoodsForm ? [FoodsFormStep] : []),
    ...(isMixedFeedingBenefitsOfBreastfeeding
      ? [MixedBenefitsOfBreastfeedingStep]
      : []),
    ...(isMixedFeedingHowBreastfeedingWorks
      ? [MixedBreastfeedingWorksStep]
      : []),
    ...(isMixedFeedingUnsafeFeedingPractices
      ? [MixedUnsafeFeedingPracticesStep]
      : []),
    ...(isMixedFeedingFistFoods ? [FirstFoodsStep] : []),
    ...(isMixedFeedingComplementaryFeeding ? [ComplementaryFeedingStep] : []),
  ];

  const complementaryFeedingFlow = [
    AlcoholUseStep,
    HivCareAndMedicationStep,
    IdDocumentStep,
    InfantCareStep,
  ];

  if (!!nutritionAnswer) {
    switch (nutritionAnswer) {
      case nutritionAnswers.mixedFeeding:
        return [
          ...defaultScreens,
          ...mixedFeedingFlow,
          ...complementaryFeedingFlow,
        ];
      case nutritionAnswers.formulaMilkOnly:
        return [
          ...defaultScreens,
          ...formulaMilkOnlyFlow,
          ...complementaryFeedingFlow,
        ];
      default:
        return [
          ...defaultScreens,
          ...breastMilkOnlyFlow,
          ...complementaryFeedingFlow,
        ];
    }
  }

  return [...defaultScreens, ...complementaryFeedingFlow];
};

export const dangerSignsSteps = (
  isDevelopmentalScreeningWeeksFollowUp: boolean
) => [
  DevelopmentalScreeningStep,
  // ...(isDevelopmentalScreeningWeeksFollowUp
  //   ? [DevelopmentalScreeningWeeksFollowUpStep]
  //   : []),
  DangerSignsStep,
];

export const followUpSteps = (isReferralsStep: boolean) => [
  NotesStep,
  ...(isReferralsStep ? [ReferralsStep] : []),
  ProgressStep,
  NextVisitStep,
];
