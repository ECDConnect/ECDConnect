import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
query ($search: String, $clinicSearch: String, $provinceSearch: String) {
  allHealthCareWorkers(
    search: $search
    clinicSearch: $clinicSearch
    provinceSearch: $provinceSearch
  ) {
    id
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
    profileImageUrl
    roles {
      id
      name
    }
    }
    teamLead {
      clinic {
        name
        siteAddress {
          province {
            description
          }
        }
      }
    }
  }
}
`;

export const GetHealthCareWorkerByUserId = gql`
query GetHealthCareWorkerByUserId($userId: UUID) {
  GetHealthCareWorkerById(id: $userId) {
    id
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
  mutation updateHealthCareWorker($input: HealthCareWorkerInput, $id: UUID) {
    updateHealthCareWorker(id: $id, input: $input) {
      id
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
    createdUsers {
      id
    }
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
