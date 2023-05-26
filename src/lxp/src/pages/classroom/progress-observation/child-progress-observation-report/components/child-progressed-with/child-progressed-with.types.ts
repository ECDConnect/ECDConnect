import { ChildProgressedWithFormModel } from '@/schemas/classroom/child-progress-observations/child-progressed-with-form';

export interface ChildProgressedWithProps {
  onSubmit: (formValue: ChildProgressedWithFormModel, exit: boolean) => void;
  childId: string;
}
