import { ChildProgressReport } from '@/models/progress/child-progress-report';
import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
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

  // Not sure if this should be on a different store
  childProgressReports: (ChildProgressReport & OfflineUpdate)[];
};
