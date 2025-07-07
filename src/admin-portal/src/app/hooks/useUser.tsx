import { useQuery } from '@apollo/client';
import { PermissionDto, UserDto } from '@ecdlink/core';
import { GetUserById } from '@ecdlink/graphql';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface UserContextType {
  user?: UserDto;
  hasPermission: (permissionName: string) => boolean;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}): JSX.Element {
  const [user, setUser] = useState<UserDto>();
  const [userPermissions, setUserPermissions] = useState<PermissionDto[]>();

  const { data: userData, loading } = useQuery(GetUserById, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: userId,
    },
  });

  useEffect(() => {
    if (userData && userData.userById) {
      setUser(userData.userById);

      const permissions = userData.userById.roles.flatMap((x) => x.permissions);
      setUserPermissions(permissions ?? []);
    }
  }, [userData]);

  const hasPermission = (permissionName: string): boolean => {
    const permissionNames = userPermissions?.map((x) => x.name);
    return permissionNames?.includes(permissionName);
  };

  const memoedValue = useMemo(
    () => ({
      user,
      hasPermission,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={memoedValue as UserContextType}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  return useContext(UserContext);
}
