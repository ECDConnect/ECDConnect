import * as Yup from 'yup';
import { ReasonForLeavingPractitionerDto } from '../models/dto/StaticData/reason-for-leaving-practitioner.dto';

export const initialReasonForLeavingPractitionerValues: ReasonForLeavingPractitionerDto =
  {
    description: '',
    enumId: '',
  };

export const reasonForLeavingPractitionerSchema = Yup.object().shape({
  description: Yup.string(),
});
