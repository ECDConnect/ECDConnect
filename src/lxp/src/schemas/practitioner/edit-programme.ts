import * as Yup from 'yup';

export interface EditProgrammeModel {
  name: string;
  type: string;
  isPrincipalOrLeader: boolean;
  smartStartPractitioners: number;
  nonSmartStartPractitioners: number;
  isPrincipleOrOwnerSmartStarter: boolean;
  // assistants: number;
  // isTeacher: boolean;
}

export const editProgrammeSchema = Yup.object().shape({
  isPrincipleOrLeader: Yup.boolean().required(),
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
  isPrincipleOrOwnerSmartStarter: Yup.boolean().when('isPrincipalOrLeader', {
    is: false,
    then: Yup.boolean().required(),
  }),
});
