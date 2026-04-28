import * as Yup from 'yup';

export interface UpdateRegistrationModel {
  certificates?: string[];
}

export const initialUpdateRegistrationModel: UpdateRegistrationModel = {
  certificates: undefined,
};

export const updateRegistrationSchema = Yup.object().shape({
  certificates: Yup.array().of(Yup.string()),
});
