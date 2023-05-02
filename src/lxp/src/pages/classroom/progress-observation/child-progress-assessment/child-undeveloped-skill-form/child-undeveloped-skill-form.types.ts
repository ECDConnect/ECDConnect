import { ProgressTrackingSkillDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ChildUndevelopedSkillFormProps extends ComponentBaseProps {
  undevelopedSkills: ProgressTrackingSkillDto[];
  allSkillsYes: boolean;
  noTryingToDoAndAtLeastOneNotYet: boolean;
  childId?: string;
  onSubmit: (skill: ProgressTrackingSkillDto | undefined) => void;
}
