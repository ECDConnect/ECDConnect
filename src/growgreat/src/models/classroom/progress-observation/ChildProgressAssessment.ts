import {
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';

export interface ChildProgressSubCategoryAssessment {
  subCategory: ProgressTrackingSubCategoryDto;
  level: ProgressTrackingLevelDto;
  skills: ProgressTrackingSkillDto[];
}

export interface CategoryLevelFormResult {
  progressTrackingCategoryId: number;
  levelId: number;
  selectedSkills: ProgressTrackingSkillDto[];
  missedSkills: ProgressTrackingSkillDto[];
}

export interface CategoryLevelFormSelectedSkills {
  skillIds: number[];
}
