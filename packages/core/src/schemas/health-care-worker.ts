import * as Yup from 'yup';
import { HealthCareWorkerDto } from '../models';

export const initialHealthCareWorkerValues: HealthCareWorkerDto = {
  consentForPhoto: false,
  languageId: '',
  teamLeadId: '',
  clickedContactTab: false,
  clickedDashboardClientsTab: false,
  clickedDashboardHighlightsTab: false,
  clickedDashboardVisitsTab: false,
  clickedProgressTab: false,
  clickedReferralsTab: false,
  clickedTeamTab: false,
  clickedVisitTab: false,
  isNewAtClinic: true,
  shareContactInfo: false,
  welcomeMessage: '',
};

export const healthCareWorkerSchema = Yup.object().shape({
  consentForPhoto: Yup.bool(),
  languageId: Yup.string(),
  teamLeadId: Yup.string(),
});
