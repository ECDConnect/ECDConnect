import { ProgressTrackingSubCategoryDto } from './progress-tracking-sub-category.dto';

export interface ProgressTrackingCategoryDto {
  id: number;
  imageUrl: string;
  color: string;
  name: string;
  subTitle: string;
  description: string;
  subCategories: ProgressTrackingSubCategoryDto[];
}
