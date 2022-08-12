import * as Yup from 'yup';
import { FranchisorDto } from '../models/dto/Users/franchisor.dto';

export const initialFranchisorValues: FranchisorDto = {
  areaOfOperation: '',
  secondaryAreaOfOperation: '',
  startDate: undefined,
};

export const franchisorSchema = Yup.object().shape({
  areaOfOperation: Yup.string(),
  secondaryAreaOfOperation: Yup.string(),
  startDate: Yup.date(),
});
