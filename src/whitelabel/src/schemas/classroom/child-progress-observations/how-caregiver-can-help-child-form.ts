import * as Yup from 'yup';

export interface CaregiverCanHelpChildWithFormModel {
  howCanCaregiverHelpChild: string;
}

export const caregiverCanHelpChildWithFormSchema = Yup.object().shape({
  howCanCaregiverHelpChild: Yup.string().required(),
});
