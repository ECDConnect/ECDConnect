import * as Yup from 'yup';
import { LanguageDto } from '../models/dto/StaticData/language.dto';

export const initialLanguageValues: LanguageDto = {
  description: '',
  locale: '',
};

export const languageSchema = Yup.object().shape({
  description: Yup.string(),
});
