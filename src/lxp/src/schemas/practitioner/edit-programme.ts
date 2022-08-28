import * as Yup from 'yup';

export interface EditProgrammeModel {
  name: string;
  type: string;
  isPrincipalOrLeader: boolean;
  smartStartPractitioners: number;
  nonSmartStartPractitioners: number;
  isPrincipleOrOwnerSmartStarter: boolean;
}

export const editProgrammeSchema = Yup.object().shape({
  isPrincipalOrLeader: Yup.boolean().required(),
  isPrincipleOrOwnerSmartStarter: Yup.boolean().when('isPrincipalOrLeader', {
    is: false,
    then: Yup.boolean().required(),
  }),
  name: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string().required(),
  }),
  type: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string().required(),
  }),
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
});
