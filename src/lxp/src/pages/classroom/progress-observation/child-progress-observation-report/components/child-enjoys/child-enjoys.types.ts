import { ChildEnjoysFormModel } from '@schemas/classroom/child-progress-observations/child-enjoys-form';

export interface ChildEnjoysProps {
  onSubmit: (formValue: ChildEnjoysFormModel, exit: boolean) => void;
  childId: string;
}
