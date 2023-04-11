import { ProgressTrackingSkillDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ChildUndevelopedSkillFormProps extends ComponentBaseProps {
  undevelopedSkills: ProgressTrackingSkillDto[];
  childId?: string;
  onSubmit: (skill: ProgressTrackingSkillDto) => void;
}
