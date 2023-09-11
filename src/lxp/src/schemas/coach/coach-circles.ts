import { ClubDto, PractitionerDto } from '@ecdlink/core';
import * as Yup from 'yup';

export interface CoachCirclesModel {
  date: Date | string;
  practitioners: PractitionerDto[];
  club: ClubDto;
  topic: string;
  meetingNotes: string;
}

export const reassignClassSchema = Yup.object().shape({
  date: Yup.date().required(),
  practitioners: Yup.array().required().min(1),
  club: Yup.string().required(),
  topic: Yup.string(),
  meatingNotes: Yup.string(),
});
