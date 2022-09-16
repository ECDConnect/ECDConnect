import * as Yup from 'yup';

export interface PregnantMaternalCaseRecordModel {
  deliveryDate?: Date;
  maternalCaseRecord?: string;
  notHaveAMaternalRecord?: boolean;
}

export const initialPregnantMaternalCaseRecordValues: PregnantMaternalCaseRecordModel =
  {
    deliveryDate: new Date(0),
    maternalCaseRecord: '',
    notHaveAMaternalRecord: false,
  };

export const pregnantMaternalCaseRecordModelSchema = Yup.object().shape({
  deliveryDate: Yup.date().required('Delivery date is required'),
  maternalCaseRecord: Yup.string(),
  notHaveAMaternalRecord: Yup.bool(),
});
