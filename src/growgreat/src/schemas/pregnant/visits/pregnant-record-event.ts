import * as Yup from 'yup';

export interface PregnantRecordEventModel {
  eventRecordTypeId: string;
  childrenEventRecordTypeId?: string;
  notes: string;
}

export const initialPregnantRecordEventValues: PregnantRecordEventModel = {
  eventRecordTypeId: '',
  childrenEventRecordTypeId: '',
  notes: '',
};

export const pregnantRecordEventModelSchema = Yup.object().shape({
  eventRecordTypeId: Yup.string().required('Event is required'),
  childrenEventRecordTypeId: Yup.string(),
  notes: Yup.string(),
});
