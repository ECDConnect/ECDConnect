import { useMemo } from 'react';
import { UserRoles } from '../constants/user';
import { useUser } from './useUser';

export const useUserRole = () => {
  const { user } = useUser();

  const roles = useMemo(() => {
    const rolesSet = new Set(user?.roles?.map((role) => role.systemName));

    return {
      isAdministrator: rolesSet.has(UserRoles.Administrator),
      isSuperAdmin: rolesSet.has(UserRoles.SuperAdmin),
    };
  }, [user]);

  return roles;
};
