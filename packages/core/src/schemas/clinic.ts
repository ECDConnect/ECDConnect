import * as Yup from 'yup';
import { ClinicDto } from '../models';

export const initialClinicValues: ClinicDto = {
  name: '',
  phoneNumber: '',
  id: '',
  teamLeads: [],
  clinicMembers: [],
  points: undefined,
};

export const clkinicSchema = Yup.object().shape({
  name: Yup.string(),
  phoneNumber: Yup.string(),
});
