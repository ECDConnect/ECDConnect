import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
  query GetAllHealthCareWorkers(
    $search: String
    $clinicSearch: [String]
    $provinceSearch: [UUID!]
    $subDistrictSearch: [UUID!]
    $visitSearch: [String]
    $connectUsageSearch: [String]
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
      isRegistered
      user {
        id
        connectUsage
        connectUsageColor
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
        whatsAppNumber
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
      isRegistered
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
  mutation AddHealthCareWorker($input: AddHealthCareWorkerInputModelInput) {
    addHealthCareWorker(input: $input) {
      id
      userId
      clinicId
      __typename
    }
  }
`;

export const UpdateHealthCareWorkerClinic = gql`
  mutation UpdateHealthCareWorkerClinic($userId: UUID!, $clinicId: UUID!) {
    updateHealthCareWorkerClinic(userId: $userId, clinicId: $clinicId) {
      id
      userId
      clinicId
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

export const DeactivateHealthCareWorker = gql`
  mutation DeactivateHealthCareWorker($hcwId: UUID!) {
    deactivateHealthCareWorker(hcwId: $hcwId) {
      id
      userId
      isActive
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

export const GetHealthCareWorkersOptedOutOfMonthlyMeeting = gql`
  query GetHealthCareWorkersOptedOutOfMonthlyMeeting(
    $month: Int!
    $year: Int!
    $where: PortalHealthCareWorkerModelFilterInput
    $order: [PortalHealthCareWorkerModelSortInput!]
  ) {
    healthCareWorkersOptedOutOfMonthlyMeeting(
      month: $month
      year: $year
      where: $where
      order: $order
    ) {
      connectUsage
      connectUsageColor
      dateInvited
      healthCareWorkerId
      idNumber
      isActive
      name
      userId
    }
  }
`;
