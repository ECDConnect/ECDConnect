import * as Yup from 'yup';
import { ProvinceDto } from '../models/dto/StaticData/province.dto';

export const initialProvinceValues: ProvinceDto = {
  description: '',
  enumId: '',
};

export const provinceSchema = Yup.object().shape({
  description: Yup.string(),
});
