import { UserRoles } from '../constants/user';
import { useUser } from './useUser';

export const useUserRole = () => {
  const { user } = useUser();

  const isTeamLead = user?.roles?.some((x) => x.name === UserRoles.TeamLead);
  const isAdministrator = user?.roles?.some(
    (x) => x.name === UserRoles.Administrator
  );
  const isSuperAdmin = user?.roles?.some(
    (x) => x.name === UserRoles.SuperAdmin
  );

  return { isTeamLead, isAdministrator, isSuperAdmin };
};
