import * as Yup from 'yup';

export interface WelcomeMessageModel {
  message: string;
  aboutShort?: string;
  shareContactInfo?: boolean | undefined;
  shareProfilePhoto?: boolean | undefined;
  shareProvince?: boolean | undefined;
  provinceId?: string;
}

export const initialWelcomeMessageModel: WelcomeMessageModel = {
  message: '',
  aboutShort: '',
  shareContactInfo: undefined,
  shareProfilePhoto: undefined,
  shareProvince: undefined,
  provinceId: '',
};

export const welcomeMessageSchema = Yup.object().shape({
  message: Yup.string().max(125, 'Maximum 125 characters'),
  shareContactInfo: Yup.bool().required('Required'),
  shareProfilePhoto: Yup.bool().required('Required'),
  shareProvince: Yup.bool(),
  provinceId: Yup.string(),
});
