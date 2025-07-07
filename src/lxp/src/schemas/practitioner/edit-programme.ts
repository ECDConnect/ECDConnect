import * as Yup from 'yup';

export interface EditProgrammeModel {
  name: string;
  type?: string;
  isPrincipalOrLeader?: boolean;
  smartStartPractitioners?: number;
  nonSmartStartPractitioners?: number;
  isPrincipleOrOwnerSmartStarter?: boolean;
}

export const editProgrammeSchema = Yup.object().shape({
  isPrincipalOrLeader: Yup.boolean(),
  isPrincipleOrOwnerSmartStarter: Yup.boolean().when('isPrincipalOrLeader', {
    is: false,
    then: Yup.boolean(),
  }),
  name: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string(),
  }),
  type: Yup.string().when('isPrincipalOrLeader', {
    is: true,
    then: Yup.string(),
  }),
  smartStartPractitioners: Yup.number()
    .min(0)
    .when('isPrincipalOrLeader', {
      is: true,
      then: Yup.number().min(0),
      otherwise: Yup.number(),
    }),
  nonSmartStartPractitioners: Yup.number()
    .min(0)
    .when('isPrincipalOrLeader', {
      is: true,
      then: Yup.number().min(0),
      otherwise: Yup.number(),
    }),
});
