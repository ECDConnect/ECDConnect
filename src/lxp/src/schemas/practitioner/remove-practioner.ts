import * as Yup from 'yup';

export interface RemovePractionerModel {
  removeReasonId: string;
  reasonDetail: string;
  newPrincipal: string | undefined;
  reassignedClassrooms: { [id: string]: string };
}

export const initialRemovePractionerValues: RemovePractionerModel = {
  removeReasonId: '',
  reasonDetail: '',
  newPrincipal: undefined,
  reassignedClassrooms: {},
};

export const removePractionerModelSchema = Yup.object().shape({
  removeReasonId: Yup.string().required().min(1),
  // How to validate this???
  // reasonDetail: Yup.array().when('removeReasonId', {
  //   is: '4755d392-abcf-4dbe-aeda-b094ef1657e5', // Is there an actual Id???
  //   then: Yup.string().required('Reason details are required'),
  // }),
});
