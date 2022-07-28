import * as Yup from 'yup';

export interface EditProgrammeModel {
  name: string;
  type: string;
  isPrincipleOrLeader: boolean;
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
  isPrincipleOrOwnerSmartStarter: Yup.boolean().when('isPrincipleOrLeader', {
    is: false,
    then: Yup.boolean().required(),
  }),
});
