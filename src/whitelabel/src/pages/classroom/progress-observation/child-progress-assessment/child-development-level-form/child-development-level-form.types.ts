import { FormComponentProps } from '@ecdlink/core';
import { ChildDevelopmentLevelFormModel } from '@schemas/classroom/child-progress-observations/child-development-level-form';

export interface ChildDevelopmentLevelFormProps
  extends FormComponentProps<ChildDevelopmentLevelFormModel> {
  childDevelopmentLevelForm?: ChildDevelopmentLevelFormModel;
  childId: string;
  childAchievedLevelId: number;
}
