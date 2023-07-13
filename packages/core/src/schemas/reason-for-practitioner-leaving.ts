import * as Yup from 'yup';
import { ReasonForPractitionerLeavingDto } from '../models/dto/StaticData/reason-for-practitioner-leaving.dto';

export const initialReasonForPractitionerLeavingValues: ReasonForPractitionerLeavingDto =
  {
    description: '',
    enumId: '',
  };

export const reasonForPractitionerLeavingSchema = Yup.object().shape({
  description: Yup.string(),
});
