import { ProgressTrackingAgeGroupDto } from './progress-tracking-age-group.dto';
import { ProgressTrackingLevelDto } from './progress-tracking-level.dto';

export interface ProgressTrackingSkillDto {
  id: number;
  description: string;
  name: string;
  isReverseScored?: boolean;
  supportImage?: string;
}
