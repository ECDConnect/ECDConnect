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
  //removalDate: Yup.date().required(),
  // reasonDetail: Yup.array().when('removeReasonId', {
  //   is: '4755d392-abcf-4dbe-aeda-b094ef1657e5', // Is there an actual Id???
  //   then: Yup.string().required('Reason details are required'),
  // }),
});
