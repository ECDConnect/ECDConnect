import * as Yup from 'yup';
import { HealthCareWorkerDto, TeamLeadDto } from '../models';

// export const initialTeamLeadValues: TeamLeadDto = {
//   jobTitle: '',
//   clinicId: '',
// };

export const teamLeadSchema = Yup.object().shape({
  jobTitle: Yup.string(),
  clinicId: Yup.string(),
});
