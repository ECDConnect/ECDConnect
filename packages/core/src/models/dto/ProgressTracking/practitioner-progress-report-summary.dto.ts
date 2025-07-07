import { ProgressTrackingCategoryDto } from './progress-tracking-category.dto';

export interface SummaryProgressTrackingSkillDto {
  skill?: string;
  4;
  childCount?: number;
}
export interface SummaryProgressTrackingSubCategoryDto {
  id: number;
  imageUrl: string;
  name: string;
  title?: string;
  description: string;
  childrenPerSkill?: SummaryProgressTrackingSkillDto[];
}
export interface SummaryProgressTrackingCategoryDto {
  id: number;
  imageUrl: string;
  color: string;
  name: string;
  subTitle: string;
  description: string;
  subCategories: SummaryProgressTrackingSubCategoryDto[];
}

interface ClassSumaries {
  practitionerUserId?: string;
  practitionerFullName?: string;
  className?: string;
  childCount?: number;
  categories?: SummaryProgressTrackingCategoryDto[];
}

export interface PractitionerProgressReportSummaryDto {
  reportingPeriod?: string;
  classSummaries?: ClassSumaries[];
}
