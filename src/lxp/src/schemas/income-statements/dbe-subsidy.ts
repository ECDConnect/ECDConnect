import * as Yup from 'yup';
export interface DbeSubsidyModel {
  dateReceived: string;
  numberOfChildrenSupported: string;
  amount: string;
  notes?: string;
}

export const dbeSubsidySchema = Yup.object().shape({
  dateReceived: Yup.string().required(),
  numberOfChildrenSupported: Yup.number()
    .required()
    .integer()
    .positive()
    .max(100),
  amount: Yup.string().required(),
  notes: Yup.string(),
});
