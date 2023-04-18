import { FormComponentProps } from '@ecdlink/core';
import { ChildLearningSupportFormModel } from '@schemas/classroom/child-progress-observations/child-learning-support-form';

export interface ChildLearningSupportFormProps
  extends FormComponentProps<ChildLearningSupportFormModel> {
  childLearningSupportForm?: ChildLearningSupportFormModel;
  childId: string;
  helpingWithSkillId: number;
}
