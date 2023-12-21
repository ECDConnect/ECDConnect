import {
  CareForMomStep,
  ClinicCheckupStep,
  DangerSignsStep,
  DangerSignsFollowUpStep,
  SelfCareStep,
  SelfCareAndSupportStep,
  MaternalDistressStep,
  MaternalDistressScreeningStep,
  MaternalDistressFollowUpStep,
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
import { SicknessAlertStep } from './pillar-4-steps/sickness-alert';

export const getCareForMomSteps = (
  isChildBefore49Days: boolean,
  isDangerSignsFollowUp: boolean,
  isShowClinicCheckUps: boolean,
  isSelfCareAndSupport: boolean,
  isMaternalDistress: boolean,
  isMaternalDistressFollowUp: boolean,
  isMaternalDistressScreening: boolean
) => [
  ...(isShowClinicCheckUps ||
  isDangerSignsFollowUp ||
  isChildBefore49Days ||
  isSelfCareAndSupport ||
  isMaternalDistress ||
  isMaternalDistressFollowUp ||
  isMaternalDistressScreening
    ? [CareForMomStep]
    : []),
  ...(isShowClinicCheckUps ? [ClinicCheckupStep] : []),
  ...(isDangerSignsFollowUp ? [DangerSignsFollowUpStep] : []),
  ...(isChildBefore49Days ? [DangerSignsStep] : []),
  ...(isChildBefore49Days ? [SelfCareStep] : []),
  ...(isSelfCareAndSupport ? [SelfCareAndSupportStep] : []),
  ...(isMaternalDistress ? [MaternalDistressStep] : []),
  ...(isMaternalDistressFollowUp ? [MaternalDistressFollowUpStep] : []),
  ...(isMaternalDistressScreening ? [MaternalDistressScreeningStep] : []),
];

export const careForBabySteps = (
  isRoadToHeathBookStep: boolean,
  isDangerSignsFollowUp: boolean,
  isChildBefore49Days: boolean,
  isNewBornCare: boolean,
  isKangarooMotherCare: boolean
) => [
  CareForBabyStep,
  ...(isRoadToHeathBookStep ? [RoadToHeathBookStep] : []),
  ...(isDangerSignsFollowUp ? [BabyDangerSignsFollowUpStep] : []),
  ...(isChildBefore49Days ? [BabyDangerSignsStep] : []),
  ...(isNewBornCare ? [NewbornCareStep] : []),
  ...(isKangarooMotherCare ? [MotherCareStep] : []),
];

export const getPillar1Steps = ({
  nutritionAnswer,
  isToSkipBreastfeedingIssuesRelevantItemsStep,
  isShowNutritionStep,
  isFormulaMilkHowBreastfeedingWorks,
  isFormulaMilkUnsafeFeedingPractices,
  isMixedFeedingFoodsForm,
  isMixedFeedingBenefitsOfBreastfeeding,
  isMixedFeedingUnsafeFeedingPractices,
  isMixedFeedingFistFoods,
  isMixedFeedingComplementaryFeeding,
  isMixedFeedingComplementaryFeedingAfter9Months,
  isShowInterventionStep,
  isShowMuacStep,
  isDietFormStep,
  isChildAfter7Days,
}: {
  nutritionAnswer: Question['answer'];
  isToSkipBreastfeedingIssuesRelevantItemsStep: boolean;
  isShowNutritionStep: boolean;
  isFormulaMilkHowBreastfeedingWorks: boolean;
  isFormulaMilkUnsafeFeedingPractices: boolean;
  isMixedFeedingFoodsForm: boolean;
  isMixedFeedingBenefitsOfBreastfeeding: boolean;
  isMixedFeedingUnsafeFeedingPractices: boolean;
  isMixedFeedingFistFoods: boolean;
  isMixedFeedingComplementaryFeeding: boolean;
  isMixedFeedingComplementaryFeedingAfter9Months: boolean;
  isShowInterventionStep: boolean;
  isShowMuacStep: boolean;
  isDietFormStep: boolean;
  isChildAfter7Days: boolean;
}) => {
  const defaultScreens = [
    ...(isChildAfter7Days ? [WeightAndLengthFormStep] : []),
    ...(isChildAfter7Days ? [WeightAndLengthResultStep] : []),
    ...(isShowMuacStep ? [MidUpperArmCircumferenceFormStep] : []),
    ...(isShowMuacStep ? [MidUpperArmCircumferenceResultStep] : []),
    ...(isShowInterventionStep ? [InterventionsStep] : []),
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
    ...(isMixedFeedingUnsafeFeedingPractices
      ? [MixedUnsafeFeedingPracticesStep]
      : []),
    ...(isMixedFeedingFistFoods ? [FirstFoodsStep] : []),
    ...(isMixedFeedingComplementaryFeeding ||
    isMixedFeedingComplementaryFeedingAfter9Months
      ? [ComplementaryFeedingStep]
      : []),
  ];

  const complementaryFeedingFlow = isDietFormStep
    ? [DietFormStep, ResourcesStep]
    : [];

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
  isDevelopmentalScreeningWeeksFollowUp: boolean,
  isDevelopmentalScreening: boolean,
  isDevelopmentalScreeningWeeks: boolean
) => [
  ...(isDevelopmentalScreening ? [DevelopmentalScreeningStep] : []),
  ...(isDevelopmentalScreeningWeeksFollowUp
    ? [DevelopmentalScreeningWeeksFollowUpStep]
    : []),
  ...(isDevelopmentalScreeningWeeks ? [DevelopmentalScreeningWeeksStep] : []),
];

export const pillar3Steps = (
  isImmunisationQuestion: boolean,
  isVitaminAQuestion: boolean,
  isDewormingQuestion: boolean,
  isImmunisationsStep: boolean
) => [
  ...(isImmunisationsStep ? [ImmunisationsStep] : []),
  ...(isImmunisationQuestion || isVitaminAQuestion || isDewormingQuestion
    ? [ImmunisationsSupplementsDewormingStep]
    : []),
];

export const getPillar4Steps = (
  isFollowUp: boolean,
  isChildBefore49Days: boolean,
  isSicknessAlertStep: boolean,
  isToShowPillar4DangerSigns: boolean
) => [
  ...(isFollowUp ? [FollowUpStep] : []),
  ...(isChildBefore49Days ? [SicknessStep] : []),
  ...(isToShowPillar4DangerSigns ? [Pillar4DangerSignsStep] : []),
  ...(isSicknessAlertStep ? [SicknessAlertStep] : []),
];

export const pillar5Steps = (
  isChildDocumentStep: boolean,
  hivCareStep: boolean
) => [
  ...(isChildDocumentStep ? [ChildDocumentationStep] : []),
  ...(hivCareStep ? [HIVCareAndMedicationStep] : []),
];

export const followUpSteps = (isReferralsStep: boolean) => [
  NotesStep,
  ...(isReferralsStep ? [ReferralsStep] : []),
  ProgressStep,
  NextVisitStep,
];
