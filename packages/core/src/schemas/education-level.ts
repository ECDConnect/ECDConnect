import * as Yup from 'yup';
import { EducationLevelDto } from '../models/dto/StaticData/education-level.dto';

export const initialEducationLevelValues: EducationLevelDto = {
  description: '',
  enumId: '',
};

export const educationLevelSchema = Yup.object().shape({
  description: Yup.string(),
});
