import {
  PractitionerProgressReportSummaryDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';

export type ProgressTrackingState = {
  progressTrackingCategories: ProgressTrackingCategoryDto[] | undefined;
  progressTrackingSubCategories: ProgressTrackingSubCategoryDto[] | undefined;
  progressTrackingSkills: ProgressTrackingSkillDto[] | undefined;
  progressTrackingLevels: ProgressTrackingLevelDto[] | undefined;
  practitionerProgressReportSummary?:
    | PractitionerProgressReportSummaryDto
    | undefined;
};
