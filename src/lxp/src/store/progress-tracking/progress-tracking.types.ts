import { OfflineCache } from '@/models/sync/offline-cache';
import {
  PractitionerProgressReportSummaryDto,
  ProgressTrackingAgeGroupDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';

export type ProgressTrackingState = {
  progressTrackingAgeGroups: {
    data: ProgressTrackingAgeGroupDto[];
  } & OfflineCache;
  progressTrackingCategories: {
    data: ProgressTrackingCategoryDto[];
  } & OfflineCache;
  progressTrackingSubCategories: {
    data: ProgressTrackingSubCategoryDto[];
  } & OfflineCache;
  progressTrackingSkills: {
    data: ProgressTrackingSkillDto[];
  } & OfflineCache;
  progressTrackingLevels: ProgressTrackingLevelDto[] | undefined;
  practitionerProgressReportSummary?:
    | PractitionerProgressReportSummaryDto
    | undefined;
};
