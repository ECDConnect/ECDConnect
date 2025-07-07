import { ChildProgressReport } from '@/models/progress/child-progress-report';
import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import {
  PractitionerProgressReportSummaryDto,
  ProgressTrackingAgeGroupDto,
  ProgressTrackingCategoryDto,
} from '@ecdlink/core';
import { ResourceLink } from '@ecdlink/graphql';

export type ProgressTrackingState = {
  currentLocale: string;
  progressTrackingContentByLocale: ProgressTrackingCategoriesByLocale;
  progressTrackingAgeGroups: {
    data: ProgressTrackingAgeGroupDto[];
  } & OfflineCache;
  resourceLinks: ResourceLink[] | undefined;
  practitionerProgressReportSummary?:
    | PractitionerProgressReportSummaryDto
    | undefined;

  // Not sure if this should be on a different store
  childProgressReports: (ChildProgressReport & OfflineUpdate)[];
};

export type ProgressTrackingCategoriesByLocale = {
  [locale: string]: {
    data: ProgressTrackingCategoryDto[];
  } & OfflineCache;
};
