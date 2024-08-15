import { ProgressTrackingAgeGroupDto } from './progress-tracking-age-group.dto';
import { ProgressTrackingLevelDto } from './progress-tracking-level.dto';

export interface ProgressTrackingSkillDto {
  id: number;
  description: string;
  name: string;
  level: ProgressTrackingLevelDto[];
  ageGroups: ProgressTrackingAgeGroupDto[] | null;
  value: string;
  reverseScore?: boolean;
  supportImage: string;
}
