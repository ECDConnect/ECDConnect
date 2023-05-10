import { ProgressTrackingSkillDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface ChildUndevelopedSkillFormProps extends ComponentBaseProps {
  skills: {
    yes: ProgressTrackingSkillDto[];
    tryingToDo: ProgressTrackingSkillDto[];
    notYet: ProgressTrackingSkillDto[];
    none: ProgressTrackingSkillDto[];
  };
  allSkillsYes: boolean;
  childId?: string;
  onSubmit: (skill: ProgressTrackingSkillDto | undefined) => void;
}
