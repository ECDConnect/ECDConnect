import { ProgressTrackingLevelDto } from './progress-tracking-level.dto';

export interface ProgressTrackingSkillDto {
  id: number;
  description: string;
  name: string;
  level: ProgressTrackingLevelDto[];
  value: string;
}
