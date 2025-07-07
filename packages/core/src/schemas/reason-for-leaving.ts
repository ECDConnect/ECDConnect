import * as Yup from 'yup';
import { ReasonForLeavingDto } from '../models/dto/StaticData/reason-for-leaving.dto';

export const initialReasonForLeavingValues: ReasonForLeavingDto = {
  description: '',
  enumId: '',
};

export const reasonForLeavingSchema = Yup.object().shape({
  description: Yup.string(),
});
