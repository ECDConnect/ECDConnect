import { FormComponentProps } from '@ecdlink/core';
import { ChildLearningSupportFormModel } from '@schemas/classroom/child-progress-observations/child-learning-support-form';

export interface ChildLearningSupportFormProps {
  childLearningSupportForm?: ChildLearningSupportFormModel;
  childId: string;
  helpingWithSkillId: number;
  helpingWithText?: string;
  onSubmit: (formValue: ChildLearningSupportFormModel, exit: boolean) => void;
}
