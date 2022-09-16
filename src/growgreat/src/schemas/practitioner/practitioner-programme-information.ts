import * as Yup from 'yup';

export interface ProgrammeNameModel {
  name: string;
}

export const programmeNameSchema = Yup.object().shape({
  name: Yup.string().required(),
});
