import { ThumbUpIcon } from '@heroicons/react/outline';
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
  isPrincipal: false,
  isFundaAppAdmin: false,
  isTrainee: false,
  signingSignature: '',
  coachHierarchy: '',
  principalHierarchy: '',
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
  isPrincipal: Yup.bool(),
  isFundaAppAdmin: Yup.bool(),
  isTrainee: Yup.bool(),
  signingSignature: Yup.string(),
  coachHierarchy: Yup.string(),
  principalHierarchy: Yup.string(),
});
