import {
  CareForMomStep,
  ClinicCheckupStep,
  DangerSignsStep,
  SelfCareStep,
  SelfCareAndSupportStep,
  MaternalDistressStep,
  MaternalDistressScreeningStep,
} from './care-for-mom-steps';
import {
  CareForBabyStep,
  RoadToHeathBookStep,
  DangerSignsStep as BabyDangerSignsStep,
  NewbornCareStep,
  MotherCareStep,
} from './care-for-baby-steps';
import {
  WeightAndLengthFormStep,
  WeightAndLengthResultStep,
  MidUpperArmCircumferenceStep,
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
} from './pillar-2-steps';

import { nutritionAnswers } from './pillar-1-steps/nutrition';
import { Question } from './dynamic-form';

export const careForMomSteps = [
  CareForMomStep,
  ClinicCheckupStep,
  DangerSignsStep,
  SelfCareStep,
  SelfCareAndSupportStep,
  MaternalDistressStep,
  MaternalDistressScreeningStep,
];

export const careForBabySteps = [
  CareForBabyStep,
  RoadToHeathBookStep,
  BabyDangerSignsStep,
  NewbornCareStep,
  MotherCareStep,
];

export const getPillar1Steps = (
  nutritionAnswer: Question['answer'],
  isToSkipBreastfeedingIssuesRelevantItemsStep: boolean
) => {
  const defaultScreens = [
    WeightAndLengthFormStep,
    WeightAndLengthResultStep,
    MidUpperArmCircumferenceStep,
    InterventionsStep,
    NutritionStep,
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
    BreastfeedingWorksStep,
    UnsafeFeedingPracticesStep,
  ];

  const mixedFeedingFlow = [
    FoodsFormStep,
    MixedBenefitsOfBreastfeedingStep,
    MixedBreastfeedingWorksStep,
    MixedUnsafeFeedingPracticesStep,
    FirstFoodsStep,
    ComplementaryFeedingStep,
  ];

  const complementaryFeedingFlow = [DietFormStep, ResourcesStep];

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
};

export const pillar2Steps = [
  DevelopmentalScreeningStep,
  DevelopmentalScreeningWeeksStep,
];
