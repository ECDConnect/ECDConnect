import * as Yup from 'yup';
import { ChildDto } from '../models/dto/Users/child.dto';

export const initialChildValues: ChildDto = {
  allergies: '',
  disabilities: '',
  otherHealthConditions: '',
  languageId: '',
};

export const childSchema = Yup.object().shape({
  allergies: Yup.string(),
  disabilities: Yup.string(),
  otherHealthConditions: Yup.string(),
});
