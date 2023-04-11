export enum ChildProgressAssessmentSteps {
  assessmentStepOne = 1,
  assessmentStepTwo = 2,
  assessmentStepThree = 3,
  assessmentStepFour = 4,
  assessmentStepFive = 5,
  assessmentStepSix = 6,
}

export interface ChildProgressAssessmentRouteState {
  step?: ChildProgressAssessmentSteps;
  childId: string;
  progressTrackingCategoryId: number;
  returnToOverview?: boolean;
  reportingDate?: string;
}
