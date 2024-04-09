import { useUserRole } from '../../hooks/useUserRole';
import ClinicsAdminView from './main-view/admin-view/clinics';
import { ClinicsTeamLeadView } from './main-view/team-lead-view/clinics';

export const ClinicsMainPage = () => {
  const { isTeamLead } = useUserRole();

  if (true) {
    return <ClinicsTeamLeadView />;
  }

  return <ClinicsAdminView />;
};
