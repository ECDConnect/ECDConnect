import * as Yup from 'yup';

export interface WelcomeMessageModel {
  message: string;
}

export const welcomeMessageSchema = Yup.object().shape({
  message: Yup.string().required('Required').max(125, 'Maximum 125 characters'),
});
