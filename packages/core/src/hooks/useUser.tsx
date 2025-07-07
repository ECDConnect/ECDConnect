import { useLazyQuery } from '@apollo/client';
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useMemo,
//   useState
// } from 'react';
// import { LocalStorageKeys } from '../enums/local-storage-keys';
// import { GetUserById } from '../graphql/users';
// import { UserDto } from '../models/dto/Users/user.dto';

// export interface UserContextType {
//   userContext?: UserDto;
//   loading: boolean;
//   children: React.ReactNode | React.ReactNode[] | null;
// }

// const UserContext = createContext<UserContextType>({} as UserContextType);

// export function UserProvider({
//   children,
// }: {
//   children: ReactNode;
// }): JSX.Element {
//   const [userContext, setUser] = useState<UserDto>();
//   const [loading, setLoading] = useState<boolean>(true);

//   const [getUserById, { data: userData }] = useLazyQuery(GetUserById, {
//     variables: {
//       userId: '',
//     },
//     fetchPolicy: 'network-only',
//   });

//   useEffect(() => {
//     const userString = localStorage.getItem(LocalStorageKeys.user);
//     if (userString) {
//       const user = JSON.parse(userString);
//       if (user) {
//         getUserById({ variables: { userId: user.id } });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (userData) {
//       setUser(userData.GetUserById)
//       setLoading(false);
//     }
//   }, [userData]);

//   // const [getPractitioner, { data: practitionerData }] = useLazyQuery(
//   //   GetPractitionerById,
//   //   {
//   //     variables: {
//   //       Id: 0,
//   //     },
//   //     fetchPolicy: 'network-only',
//   //   }
//   // );

//   // async function getPractitionerById(id: number): Promise<Practitioner> {
//   //   getPractitioner({
//   //     variables: {
//   //       Id: id,
//   //     },
//   //   });

//   //   return practitionerData.GetPractitionerById;
//   // }

//   // Make the provider update only when it should
//   const memoedValue = useMemo(
//     () => ({
//       userContext,
//       loading,
//     }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [userContext, loading]
//   );

//   return (
//     <UserContext.Provider value={memoedValue as UserContextType}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser(): UserContextType {
//   return useContext(UserContext);
// }
