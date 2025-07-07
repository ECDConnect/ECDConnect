import { startOfDay } from 'date-fns';
import * as Yup from 'yup';

export interface ProgrammeTimingModel {
  date: string;
  endDate?: string;
  language: string;
}

export const programmeTimingSchema = Yup.object().shape({
  date: Yup.date()
    .min(
      startOfDay(new Date()),
      'Start date of the programme cannot be in the past'
    )
    .required(),
  language: Yup.string().required(),
});
