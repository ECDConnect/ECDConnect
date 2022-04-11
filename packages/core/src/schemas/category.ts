import * as Yup from 'yup';

export const initialCategoryValues = {
  imageUrl: undefined as any,
  title: '',
  subTitle: '',
  color: '',
};

export const categorySchema = Yup.object().shape({
  title: Yup.string().required(),
  subTitle: Yup.string().required(),
  color: Yup.string().required(),
});
