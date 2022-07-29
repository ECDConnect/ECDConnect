import * as Yup from 'yup';

export interface EditProgrammeModel {
  name: string;
  type: string;
  isPrincipleOrLeader: boolean;
  smartStartPractitioners: number;
  nonSmartStartPractitioners: number;
  assistants: number;
  isTeacher: boolean;
}

export const editProgrammeSchema = Yup.object().shape({
  name: Yup.string().required(),
  type: Yup.string().required(),
  isPrincipleOrLeader: Yup.boolean().required(),
  smartStartPractitioners: Yup.string().when('isPrincipleOrLeader', {
    is: true,
    then: Yup.string().required(),
    otherwise: Yup.string(),
  }),
  nonSmartStartPractitioners: Yup.string().when('isPrincipleOrLeader', {
    is: true,
    then: Yup.string().required(),
    otherwise: Yup.string(),
  }),
  assistants: Yup.string().when('isPrincipleOrLeader', {
    is: true,
    then: Yup.string().required(),
    otherwise: Yup.string(),
  }),
  isTeacher: Yup.boolean(),
});
