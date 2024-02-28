import * as Yup from 'yup';
import { HealthCareWorkerDto } from '../models';

// export const initialHealthCareWorkerValues: HealthCareWorkerDto = {
//   consentForPhoto: false,
//   languageId: '',
//   teamLeadId: '',
// };

export const healthCareWorkerSchema = Yup.object().shape({
  consentForPhoto: Yup.bool(),
  languageId: Yup.string(),
  teamLeadId: Yup.string(),
});
