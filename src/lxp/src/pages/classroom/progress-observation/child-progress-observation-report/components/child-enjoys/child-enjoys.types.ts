import { FormComponentProps } from '@ecdlink/core';
import { ChildEnjoysFormModel } from '@schemas/classroom/child-progress-observations/child-enjoys-form';

export interface ChildEnjoysProps extends FormComponentProps<ChildEnjoysFormModel> {
  childId: string;
}
