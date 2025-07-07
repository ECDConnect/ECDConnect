import { ProgressTrackingSkillDto } from './progress-tracking-skill.dto';

export interface ProgressTrackingSubCategoryDto {
  id: number;
  imageUrl: string;
  name: string;
  title?: string;
  description: string;
  skills: ProgressTrackingSkillDto[];
}
