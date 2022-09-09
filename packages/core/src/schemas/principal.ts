import * as Yup from 'yup';
import { PrincipalDto } from '../models/dto/Users/principal.dto';

export const initialPrincipalValues: PrincipalDto = {
  attendanceRegisterLink: '',
  maxChildren: 0,
  parentFees: 0,
  languageUsedInGroups: '',
  monthSinceFranchisee: 0,
  startDate: new Date(),
  consentForPhoto: false,
  isPrincipal: true,
  isFundaAppAdmin: false,
  isTrainee: false,
  signingSignature: '',
};

export const principalSchema = Yup.object().shape({
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
});
