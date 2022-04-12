import * as Yup from 'yup';
import { GrantDto } from '../models/dto/StaticData/grant.dto';

export const initialGrantValues: GrantDto = {
  description: '',
  enumId: '',
};

export const grantSchema = Yup.object().shape({
  description: Yup.string(),
});
