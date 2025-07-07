import * as Yup from 'yup';

export interface EditProfileInformationModel {
  email: string;
}

export const editCoachProfileSchema = Yup.object().shape({
  email: Yup.string().required('Email address is required'),
});
