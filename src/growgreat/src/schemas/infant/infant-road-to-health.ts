import * as Yup from 'yup';

export interface InfantRoadToHealthModel {
  weightAtBirth?: number;
  lengthAtBirth?: number;
  height?: number;
  roadToHealthBook?: string;
  notRoadToHealthBook?: boolean;
}

export const initialInfantRoadToHealthValues: InfantRoadToHealthModel = {
  weightAtBirth: 0,
  lengthAtBirth: 0,
  roadToHealthBook: '',
  notRoadToHealthBook: false,
};

const numericRegex = /^[1-9]\d?(?:\.\d{0,1})?$/;
export const infantRoadToHealthModelSchema = Yup.object().shape({
  weightAtBirth: Yup.number()
    .required('Please enter a valid weight.')
    .min(0, 'Please enter a valid weight.')
    .max(50, 'Please enter a valid weight.')
    .test('is-decimal-weight', 'Please enter a valid weight.', (val: any) => {
      if (val !== undefined) {
        return numericRegex.test(val);
      }
      return true;
    })
    .typeError('Please enter a valid weight.'),
  lengthAtBirth: Yup.number()
    .required('Please enter a valid length.')
    .min(0, 'Please enter a valid length.')
    .max(250, 'Please enter a valid length.')
    .test('is-decimal-length', 'Please enter a valid length.', (val: any) => {
      if (val !== undefined) {
        return numericRegex.test(val);
      }
      return true;
    })
    .typeError('Please enter a valid length.'),
  roadToHealthBook: Yup.string(),
  notRoadToHealthBook: Yup.boolean(),
});
