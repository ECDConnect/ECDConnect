import { ThumbUpIcon } from '@heroicons/react/outline';
import * as Yup from 'yup';
import { PractitionerDto } from '../models/dto/Users/practitioner.dto';

export const initialPractitionerValues: PractitionerDto = {
  attendanceRegisterLink: '',
  parentFees: 0,
  languageUsedInGroups: '',
  startDate: new Date(),
  consentForPhoto: false,
  isPrincipal: false,
  signingSignature: '',
  coachHierarchy: '',
  principalHierarchy: '',
};

export const practitionerSchema = Yup.object().shape({
  attendanceRegisterLink: Yup.string(),
  parentFees: Yup.number(),
  languageUsedInGroups: Yup.string(),
  startDate: Yup.date(),
  consentForPhoto: Yup.bool(),
  sendInvite: Yup.bool(),
  isPrincipal: Yup.bool(),
  signingSignature: Yup.string(),
  coachHierarchy: Yup.string(),
  principalHierarchy: Yup.string(),
});
