import * as Yup from 'yup';
import { RelationDto } from '../models/dto/StaticData/relation.dto';

export const initialRelationValues: RelationDto = {
  description: '',
  enumId: '',
};

export const relationSchema = Yup.object().shape({
  description: Yup.string(),
});
