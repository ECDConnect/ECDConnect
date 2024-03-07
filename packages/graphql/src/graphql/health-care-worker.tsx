import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
  query (
    $search: String
    $clinicSearch: String
    $provinceSearch: String
    $subDistrictSearch: String
    $visitSearch: String
    $connectUsageSearch: String
    $pagingInput: PagedQueryInput
    $order: [PortalUsersHCWModelSortInput!]
  ) {
    allHealthCareWorkers(
      search: $search
      clinicSearch: $clinicSearch
      provinceSearch: $provinceSearch
      subDistrictSearch: $subDistrictSearch
      visitSearch: $visitSearch
      connectUsageSearch: $connectUsageSearch
      pagingInput: $pagingInput
      order: $order
    ) {
      id
      insertedDate
      clinicId
      user {
        connectUsage
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
        __typename
      }
      __typename
    }
  }
`;

export const GetHealthCareWorkerByUserId = gql`
  query GetHealthCareWorkerByUserId($userId: UUID) {
    GetHealthCareWorkerById(id: $userId) {
      id
      insertedDate
      clinicId
      user {
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
        insertedDate
        lockoutEnd
        __typename
      }
    }
  }
`;

export const CreateHealthCareWorker = gql`
  mutation addHealthCareWorker($input: HealthCareWorkerModelInput) {
    addHealthCareWorker(input: $input) {
      id
    }
  }
`;

export const UpdateHealthCareWorker = gql`
  mutation updateHealthCareWorker($input: UserModelInput, $id: String) {
    updateUser(id: $id, input: $input) {
      id
      __typename
    }
  }
`;

export const UploadHealthCareWorkers = gql`
  mutation ($file: String) {
    importHealthCareWorkers(file: $file) {
      validationErrors {
        row
        errors
        errorDescription
      }
      createdUsers
    }
  }
`;

export const HealthCareWorkerTemplate = gql`
  query {
    healthCareWorkerTemplateGenerator {
      fileType
      base64File
      fileName
      extension
    }
  }
`;

export const GetHealthCareWorkerSummaryForPeriod = gql`
  query (
    $userId: String
    $healthCareWorkerId: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    healthCareWorkerSummaryForPeriod(
      userId: $userId
      healthCareWorkerId: $healthCareWorkerId
      startDate: $startDate
      endDate: $endDate
    ) {
      totalPregnantMomsWithIssues
      totalCaregiversAndChildrenWithIssues
      totalPregnantMoms
      totalChildren
      totalClientsVisited
      totalFoldersOpened
      totalVisitsMissed
      totalPregnantMomsWithUrgentIssues
      totalCaregiversAndChildrenWithUrgentIssues
      totalPregnantMomsWithNoIssues
      totalChildrenWithNoIssues
      totalVisitsOverdue
      __typename
    }
  }
`;
