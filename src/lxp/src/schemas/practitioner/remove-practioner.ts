import { ReasonsForPractitionerLeaving } from '@ecdlink/core';
import * as Yup from 'yup';

export interface RemovePractionerModel {
  removeReasonId: string;
  reasonDetail: string;
  requirePrincipal: boolean;
  newPrincipalId: string | undefined;
  requireClassReassignments: boolean;
  reassignedClassrooms: { [id: string]: string | undefined };
}

export const initialRemovePractionerValues: RemovePractionerModel = {
  removeReasonId: '',
  reasonDetail: '',
  requirePrincipal: false,
  newPrincipalId: undefined,
  requireClassReassignments: true,
  reassignedClassrooms: {},
};

export const removePractionerModelSchema = Yup.object().shape({
  removeReasonId: Yup.string().required().min(1),
  reasonDetail: Yup.string().when('removeReasonId', {
    is: ReasonsForPractitionerLeaving.OTHER,
    then: Yup.string().required('Reason details are required'),
  }),
  newPrincipalId: Yup.string().when('requirePrincipal', {
    is: true,
    then: Yup.string().required('Required'),
  }),
  reassignedClassrooms: Yup.object().when('requireClassReassignments', {
    is: true,
    then: Yup.object().test(
      'is-valid',
      'Must reasign all classes',
      (reassignedClassrooms) => {
        return Object.values(reassignedClassrooms).every((x) => !!x && x != '');
      }
    ),
  }),
});
