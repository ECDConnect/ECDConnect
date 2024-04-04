import * as Yup from 'yup';
import { ClinicDto } from '../models';

export const initialClinicValues: ClinicDto = {
  name: '',
  phoneNumber: '',
  id: '',
  teamLeads: [],
  clinicMembers: [],
  points: undefined,
  leagueRanking: 0,
  pointsTotal: 0,
  maxPointsTotal: 0,
};

export const clkinicSchema = Yup.object().shape({
  name: Yup.string(),
  phoneNumber: Yup.string(),
});
