import { gql } from '@apollo/client';




export const UserList = gql`
query ($textSearch: String, $pagingInput: PagedQueryInput) {
  users(textSearch: $textSearch, pagingInput: $pagingInput) {
    id
    fullName
    idNumber
    phoneNumber
    email
  }
}
`;

export const GetUserById = gql`
  query userById($userId: String) {
    userById(userId: $userId) {
      id
      userName
      email
      isSouthAfricanCitizen
      verifiedByHomeAffairs
      dateOfBirth
      idNumber
      firstName
      surname
      fullName
      contactPreference
      genderId
      phoneNumber
      profileImageUrl
      isImported
      raceId
      languageId
      emergencyContactFirstName
      emergencyContactSurname
      emergencyContactPhoneNumber
      nextOfKinContactNumber
      nextOfKinFirstName
      nextOfKinSurname
      roles {
        id
        name
        permissions {
          id
          name
        }
      }
    }
  }
`;

export const GetAllUserHierarchyEntity = gql`
  query GetAllUserHierarchyEntity($parentId: String) {
    GetAllUserHierarchyEntity(
      where: { and: [{ parentId: { eq: $parentId } }] }
    ) {
      id
      userType
      userId
      user {
        firstName
        surname
      }
    }
  }
`;

export const SendInviteToApplication = gql`
  mutation sendInviteToApplication($userId: String) {
    sendInviteToApplication(userId: $userId)
  }
`;

export const CreateUser = gql`
  mutation addUser($input: UserModelInput) {
    addUser(input: $input) {
      id
    }
  }
`;

export const UpdateUser = gql`
  mutation updateUser($id: String!, $input: UserModelInput) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`;

export const AddUsersToRole = gql`
  mutation addUsersToRole($userId: String!, $roleNames: [String]!) {
    addUsersToRole(userId: $userId, roleNames: $roleNames)
  }
`;

export const RemoveUserFromRoles = gql`
  mutation removeUserFromRoles($userId: String!, $roleNames: [String]!) {
    removeUserFromRoles(userId: $userId, roleNames: $roleNames)
  }
`;

export const DeleteUser = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export const ResetUserPassword = gql`
  mutation resetUserPassword($id: String!, $newPassword: String!) {
    resetUserPassword(id: $id, newPassword: $newPassword)
  }
`;

export const GetUserByToken = gql`
  query userByToken($token: String) {
    userByToken(token: $token) {
      fullName
      phoneNumber
      roleName
      userId
    }
  }
`;
export const GetHealthCareWorkerHighlights = gql`
query($userId: String) {
  healthCareWorkerHighlights(userId: $userId) {
     totalThisWeekFamilyVisits
     totalThisWeekGrowthMonitored
     totalThisWeekNewClients
     totalLastWeekFamilyVisits
     totalLastWeekGrowthMonitored
     totalLastWeekNewClients
  }
}
`;
export const healthCareWorkerVisitStatus = gql`
query($userId: String) {
  healthCareWorkerVisitStatus(userId: $userId) {
    motherOverDueVisits
    motherDueVisits
    childDueVisits
  } 
}
`;

