import * as Yup from 'yup';

export interface EditProgrammeModel {
  name: string;
  type: string;
  isPrincipalOrLeader: boolean;
  smartStartPractitioners: number;
  nonSmartStartPractitioners: number;
  assistants: number;
  isTeacher: boolean;
}

export const editProgrammeSchema = Yup.object().shape({
  name: Yup.string().required(),
  type: Yup.string().required(),
  isPrincipalOrLeader: Yup.boolean().required(),
  smartStartPractitioners: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string().required(),
    otherwise: Yup.string(),
  }),
  nonSmartStartPractitioners: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string().required(),
    otherwise: Yup.string(),
  }),
  assistants: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string().required(),
    otherwise: Yup.string(),
  }),
  isTeacher: Yup.boolean(),
});
