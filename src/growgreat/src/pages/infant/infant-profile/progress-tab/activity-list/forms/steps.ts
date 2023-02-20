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
