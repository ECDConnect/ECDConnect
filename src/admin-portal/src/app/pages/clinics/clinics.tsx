import ClinicsAdminView from './main-view/admin-view/clinics';
import { ClinicsTeamLeadView } from './main-view/team-lead-view/clinics';

export const ClinicsMainPage = () => {
  // TODO: replace with real user role
  const isTeamLead = false;

  if (isTeamLead) {
    return <ClinicsTeamLeadView />;
  }

  return <ClinicsAdminView />;
};
