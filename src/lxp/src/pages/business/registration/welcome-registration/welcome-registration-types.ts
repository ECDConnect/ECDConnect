import * as Yup from 'yup';

export interface WelcomeMessageModel {
  subsidy?: string;
  challenge?: string;
  problem?: string;
  certificates?: string[];
  registration?: string;
  otherDetail?: string;
  eCaresStatus?: string;
}

export const initialWelcomeMessageModel: WelcomeMessageModel = {
  subsidy: undefined,
  challenge: undefined,
  problem: undefined,
  certificates: undefined,
  registration: undefined,
  otherDetail: undefined,
  eCaresStatus: undefined,
};

export const welcomeMessageSchema = Yup.object().shape({
  subsidy: Yup.string(),
  challenge: Yup.string(),
  problem: Yup.string().when('challenge', {
    is: (value: string) => value === 'Other',
    then: Yup.string().required('Please describe the problem'),
    otherwise: Yup.string().notRequired(),
  }),
  certificates: Yup.array().of(Yup.string()),
  registration: Yup.string(),
  otherDetail: Yup.string().when('challenge', {
    is: (value: string) => value === 'Other',
    then: Yup.string().required(
      'Please provide more details about the challenge'
    ),
    otherwise: Yup.string().notRequired(),
  }),
});
