import * as Yup from 'yup';
import { PrincipalDto } from '../models/dto/Users/principal.dto';

export const initialPrincipalValues: PrincipalDto = {
  attendanceRegisterLink: '',
  parentFees: 0,
  languageUsedInGroups: '',
  startDate: new Date(),
  consentForPhoto: false,
  isPrincipal: true,
  signingSignature: '',
};

export const principalSchema = Yup.object().shape({
  attendanceRegisterLink: Yup.string(),
  parentFees: Yup.number(),
  languageUsedInGroups: Yup.string(),
  startDate: Yup.date(),
  consentForPhoto: Yup.bool(),
  sendInvite: Yup.bool(),
  isPrincipal: Yup.bool(),
  signingSignature: Yup.string(),
});
