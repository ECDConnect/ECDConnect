import * as Yup from 'yup';

export interface WelcomeMessageModel {
  message: string;
  shareContactInfo: boolean | undefined;
}

export const welcomeMessageSchema = Yup.object().shape({
  message: Yup.string().required('Required').max(125, 'Maximum 125 characters'),
  shareContactInfo: Yup.bool().required('Required'),
});
