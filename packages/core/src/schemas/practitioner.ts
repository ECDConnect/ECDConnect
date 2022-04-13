import * as Yup from 'yup';
import { PractitionerDto } from '../models/dto/Users/practitioner.dto';

export const initialPractitionerValues: PractitionerDto = {
  attendanceRegisterLink: '',
  maxChildren: 0,
  parentFees: 0,
  languageUsedInGroups: '',
  monthSinceFranchisee: 0,
  startDate: new Date(),
  consentForPhoto: false,
};

export const practitionerSchema = Yup.object().shape({
  attendanceRegisterLink: Yup.string(),
  maxChildren: Yup.number(),
  parentFees: Yup.number(),
  languageUsedInGroups: Yup.string(),
  monthSinceFranchisee: Yup.number(),
  startDate: Yup.date(),
  consentForPhoto: Yup.bool(),
  sendInvite: Yup.bool(),
});
