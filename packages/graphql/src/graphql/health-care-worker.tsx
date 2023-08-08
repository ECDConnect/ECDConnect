import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
  query (
    $search: String
    $clinicSearch: String
    $provinceSearch: String
    $teamLeadSearch: String
    $pagingInput: PagedQueryInput
    $order: [HealthCareWorkerSortInput!]
  ) {
    allHealthCareWorkers(
      search: $search
      clinicSearch: $clinicSearch
      provinceSearch: $provinceSearch
      teamLeadSearch: $teamLeadSearch
      pagingInput: $pagingInput
      order: $order
    ) {
      id
      insertedDate
      user {
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
      teamLead {
        clinic {
          name
          siteAddress {
            province {
              description
              __typename
            }
            __typename
          }
          __typename
        }
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
        roles {
          id
          name
          __typename
        }
        __typename
      }
      teamLead {
        clinic {
          siteAddress {
            id
            province {
              id
              description
              __typename
            }
            name
            addressLine1
            addressLine2
            addressLine3
            postalCode
            ward
            __typename
          }
          __typename
        }
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
