import * as Yup from 'yup';
import { ContentTypeDto } from '../models/dto/Content/content-type.dto';

export const initialContentTypeValues: ContentTypeDto = {
  name: '',
  description: '',
};

export const contentTypeSchema = Yup.object().shape({
  name: Yup.string(),
  description: Yup.string(),
});
