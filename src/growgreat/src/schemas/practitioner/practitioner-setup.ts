import * as Yup from 'yup';

export interface PractitionerSetupModel {
  languageId?: string;
}

export const initialPractitionerSetupValues: PractitionerSetupModel = {
  languageId: '',
};

export const practitionerSetupModelSchema = Yup.object().shape({
  languageId: Yup.string().required('Language is required'),
});
