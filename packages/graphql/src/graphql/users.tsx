import { gql } from '@apollo/client';

export const UserList = gql`
  query (
    $pagingInput: PagedQueryInput
    $search: String
    $order: [ApplicationUserSortInput!]
  ) {
    users(pagingInput: $pagingInput, search: $search, order: $order) {
      id
      isActive
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
      insertedDate
      lockoutEnd
      roles {
        id
        name
        __typename
      }
      __typename
    }
  }
`;

export const GetUserById = gql`
  query userById($userId: String) {
    userById(userId: $userId) {
      id
      isActive
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
      resetData
      raceId
      languageId
      insertedDate
      lockoutEnd
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
  mutation sendInviteToApplication($userId: String, $inviteToPortal: Boolean) {
    sendInviteToApplication(userId: $userId, inviteToPortal: $inviteToPortal)
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

export const EnableUser = gql`
  mutation enableUser($id: String!) {
    enableUser(id: $id)
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
  query ($userId: String) {
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
  query ($userId: String) {
    healthCareWorkerVisitStatus(userId: $userId) {
      motherOverDueVisits
      motherDueVisits
      childDueVisits
    }
  }
`;

export const sentInviteToMultipleUsers = gql`
  mutation SendBulkInviteToPortal($userIds: [String]) {
    sendBulkInviteToPortal(userIds: $userIds) {
      success
      failed
    }
  }
`;
export const deleteMultipleUsers = gql`
  mutation BulkDeleteUser($ids: [String]) {
    BulkDeleteUser(ids: $ids) {
      success
      failed
    }
  }
`;

export const getUserCount = gql`
  query countUsers($search: String, $pagingInput: PagedQueryInput) {
    countUsers(search: $search, pagingInput: $pagingInput)
  }
`;

export const getHealthCareWorkerCount = gql`
  query countHealthCareWorker(
    $search: String
    $clinicSearch: String
    $provinceSearch: String
  ) {
    countHealthCareWorkers(
      search: $search
      clinicSearch: $clinicSearch
      provinceSearch: $provinceSearch
    )
  }
`;

export const getTeamLeadCount = gql`
  query countTeamLead(
    $search: String
    $clinicSearch: String
    $provinceSearch: String
    $pagingInput: PagedQueryInput
  ) {
    countTeamLeads(
      search: $search
      clinicSearch: $clinicSearch
      provinceSearch: $provinceSearch
      pagingInput: $pagingInput
    )
  }
`;
