import * as Yup from 'yup';

export const initialSubCategoryValues = {
  imageUrl: undefined as any,
  title: '',
  categoryId: 0,
};

export const subCategorySchema = Yup.object().shape({
  title: Yup.string().required(),
  categoryId: Yup.number().required(),
});
