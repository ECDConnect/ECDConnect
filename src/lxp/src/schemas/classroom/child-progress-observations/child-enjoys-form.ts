import * as Yup from 'yup';

export interface ChildEnjoysFormModel {
  childEnjoys: string;
}

export const childEnjoysFormSchema = Yup.object().shape({
  childEnjoys: Yup.string().required(),
});
