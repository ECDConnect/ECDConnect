import * as Yup from 'yup';
import { CoachDto } from '../models/dto/Users/coach.dto';

export const initialCoachValues: CoachDto = {
  areaOfOperation: '',
  secondaryAreaOfOperation: '',
  startDate: new Date() || undefined,
  signingSignature: undefined,
};

export const coachSchema = Yup.object().shape({
  areaOfOperation: Yup.string(),
  secondaryAreaOfOperation: Yup.string(),
  startDate: Yup.date(),
  signingSignature: Yup.string(),
  sendInvite: Yup.bool(),
});
