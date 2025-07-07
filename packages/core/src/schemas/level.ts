import * as Yup from 'yup';

export const initialLevelValues = {
  imageUrl: undefined as any,
  title: '',
};

export const levelSchema = Yup.object().shape({
  title: Yup.string().required(),
});
