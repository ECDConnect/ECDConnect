import * as Yup from 'yup';
import { ClinicDto } from '../models';

export const initialClinicValues: ClinicDto = {
  name: '',
  phoneNumber: '',
  id: '',
  teamLeads: [],
  clinicMembers: [],
  leagueRanking: 0,
  pointsTotal: 0,
  maxPointsTotal: 0,
  points: [],
};

export const clkinicSchema = Yup.object().shape({
  name: Yup.string(),
  phoneNumber: Yup.string(),
});
