import * as Yup from 'yup';

export const initialSkillValues = {
  levelId: 0,
  subCategoryId: 0,
};

export const skillSchema = Yup.object().shape({
  levelId: Yup.number().required(),
  subCategoryId: Yup.number().required(),
});
