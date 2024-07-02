import * as Yup from 'yup';

export interface OaLoginModel {
  username: '';
  password: string;
}

export const initialOaLoginValues: OaLoginModel = {
  username: '',
  password: '',
};

export const oaLoginSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required().min(8, 'At least 8 characters'),
});
