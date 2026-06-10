import * as Yup from 'yup';

export interface UpdateRegistrationModel {
  certificates?: string[];
  eCaresStatus?: string;
}

export const initialUpdateRegistrationModel: UpdateRegistrationModel = {
  certificates: undefined,
  eCaresStatus: undefined,
};

export const updateRegistrationSchema = Yup.object().shape({
  certificates: Yup.array().of(Yup.string()),
});
