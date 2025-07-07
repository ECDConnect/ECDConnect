import * as Yup from 'yup';
import { GenderDto } from '../models/dto/StaticData/gender.dto';

export const initialGenderValues: GenderDto = {
  description: '',
  enumId: '',
};

export const genderSchema = Yup.object().shape({
  description: Yup.string(),
});
