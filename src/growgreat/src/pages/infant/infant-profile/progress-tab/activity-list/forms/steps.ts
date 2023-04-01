import {
  CareForMomStep,
  ClinicCheckupStep,
  DangerSignsStep,
  DangerSignsFollowUpStep,
  SelfCareStep,
  SelfCareAndSupportStep,
  MaternalDistressStep,
  MaternalDistressScreeningStep,
} from './care-for-mom-steps';
import {
  CareForBabyStep,
  RoadToHeathBookStep,
  DangerSignsStep as BabyDangerSignsStep,
  DangerSignsFollowUpStep as BabyDangerSignsFollowUpStep,
  NewbornCareStep,
  MotherCareStep,
} from './care-for-baby-steps';
import {
  WeightAndLengthFormStep,
  WeightAndLengthResultStep,
  MidUpperArmCircumferenceFormStep,
  MidUpperArmCircumferenceResultStep,
  InterventionsStep,
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
  DietFormStep,
  ResourcesStep,
} from './pillar-1-steps';
import {
  DevelopmentalScreeningStep,
  DevelopmentalScreeningWeeksStep,
  DevelopmentalScreeningWeeksFollowUpStep,
} from './pillar-2-steps';
import {
  ImmunisationsStep,
  ImmunisationsSupplementsDewormingStep,
} from './pillar-3-steps';
import {
  FollowUpStep,
  SicknessStep,
  DangerSignsStep as Pillar4DangerSignsStep,
} from './pillar-4-steps';
import {
  ChildDocumentationStep,
  HIVCareAndMedicationStep,
} from './pillar-5-steps';
import {
  NotesStep,
  ReferralsStep,
  ProgressStep,
  NextVisitStep,
} from './follow-up-steps';

import { nutritionAnswers } from './pillar-1-steps/nutrition';
import { Question } from './dynamic-form';

export const getCareForMomSteps = (isDangerSignsFollowUp: boolean) => [
  CareForMomStep,
  ClinicCheckupStep,
  ...(isDangerSignsFollowUp ? [DangerSignsFollowUpStep] : []),
  DangerSignsStep,
  SelfCareStep,
  SelfCareAndSupportStep,
  MaternalDistressStep,
  MaternalDistressScreeningStep,
];

export const careForBabySteps = (isDangerSignsFollowUp: boolean) => [
  CareForBabyStep,
  RoadToHeathBookStep,
  ...(isDangerSignsFollowUp ? [BabyDangerSignsFollowUpStep] : []),
  BabyDangerSignsStep,
  NewbornCareStep,
  MotherCareStep,
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
    WeightAndLengthFormStep,
    WeightAndLengthResultStep,
    MidUpperArmCircumferenceFormStep,
    MidUpperArmCircumferenceResultStep,
    InterventionsStep,
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

  const complementaryFeedingFlow = [DietFormStep, ResourcesStep];

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

export const pillar2Steps = (
  isDevelopmentalScreeningWeeksFollowUp: boolean
) => [
  DevelopmentalScreeningStep,
  ...(isDevelopmentalScreeningWeeksFollowUp
    ? [DevelopmentalScreeningWeeksFollowUpStep]
    : []),
  DevelopmentalScreeningWeeksStep,
];

export const pillar3Steps = [
  ImmunisationsStep,
  ImmunisationsSupplementsDewormingStep,
];

export const getPillar4Steps = (isFollowUp: boolean) => [
  ...(isFollowUp ? [FollowUpStep] : []),
  SicknessStep,
  Pillar4DangerSignsStep,
];

export const pillar5Steps = [ChildDocumentationStep, HIVCareAndMedicationStep];

export const followUpSteps = (isReferralsStep: boolean) => [
  NotesStep,
  ...(isReferralsStep ? [ReferralsStep] : []),
  ProgressStep,
  NextVisitStep,
];
