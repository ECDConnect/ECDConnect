import * as Yup from 'yup';
import { NavigationDto } from '../models/dto/Navigation';

export const initialNavigationValues: NavigationDto = {
  sequence: 0,
  name: '',
  icon: '',
  route: '',
  description: '',
  permissions: [],
};

export const navigationSchema = Yup.object().shape({
  sequence: Yup.string(),
  name: Yup.string(),
  icon: Yup.string(),
  route: Yup.string(),
  description: Yup.string(),
});
