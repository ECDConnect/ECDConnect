import { ReasonsForPractitionerLeavingProgramme } from '@ecdlink/core';
import * as Yup from 'yup';

export interface RemovePractionerFromProgrammeModel {
  removeReasonId: string;
  reasonDetail: string;
  removalDate: Date | string;
  reassignedClassrooms:
    | {
        [id: string]: {
          id?: string | undefined;
          classroomGroupId: string;
          practitionerUserId?: string;
        };
      }
    | undefined;
}

export const initialRemovePractionerFromProgrammeValues: RemovePractionerFromProgrammeModel =
  {
    removeReasonId: '',
    reasonDetail: '',
    removalDate: '',
    reassignedClassrooms: {},
  };

export const removePractitionerFromProgrammeModelSchema = Yup.object().shape({
  removeReasonId: Yup.string().required().min(1),
  removalDate: Yup.date().required().min(new Date()),
  reasonDetail: Yup.string().when('removeReasonId', {
    is: ReasonsForPractitionerLeavingProgramme.OTHER,
    then: Yup.string().required('Reason details are required'),
  }),
  reassignedClassrooms: Yup.object().test(
    'is-valid',
    'Must reasign all classes',
    (reassignedClassrooms) => {
      return Object.values(reassignedClassrooms).every((x) => !!x && x != '');
    }
  ),
});
