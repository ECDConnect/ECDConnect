import * as Yup from 'yup';

export interface RecordEventModel {
  eventRecordTypeId: string;
  childrenEventRecordTypeId?: string;
  notes: string;
}

export const initialRecordEventValues: RecordEventModel = {
  eventRecordTypeId: '',
  childrenEventRecordTypeId: '',
  notes: '',
};

export const recordEventModelSchema = Yup.object().shape({
  eventRecordTypeId: Yup.string().required('Event is required'),
  childrenEventRecordTypeId: Yup.string(),
  notes: Yup.string(),
});
