import { ProgressTrackingCategoryDto } from './progress-tracking-category.dto';

interface ClassSumaries {
  practitionerUserId?: string;
  practitionerFullName?: string;
  className?: string;
  childCount?: number;
  categories?: ProgressTrackingCategoryDto[];
}

export interface PractitionerProgressReportSummaryDto {
  reportingPeriod?: string;
  classSummaries?: ClassSumaries[];
}
