import * as Yup from 'yup';

export interface UpdatePreschoolFeeModel {
  amount: string | undefined;
}

export const updatePreschoolFeeSchema = Yup.object().shape({
  amount: Yup.string(),
});
