import { CaregiverCanHelpChildWithFormModel } from '@/schemas/classroom/child-progress-observations/how-caregiver-can-help-child-form';

export interface HowCaregiverCanHelpChildProps {
  onSubmit: (
    formValue: CaregiverCanHelpChildWithFormModel,
    exit: boolean
  ) => void;
  childId: string;
}
