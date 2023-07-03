import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
query ($textSearch: String, $clinicSearch: String, $provinceSearch: String) {
  allHealthCareWorkers(
    textSearch: $textSearch
    clinicSearch: $clinicSearch
    provinceSearch: $provinceSearch
  ) {
    id
    user {
      fullName
      idNumber
      phoneNumber
      email
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
    GetHealthCareWorkerByUserId(userId: $userId) {
      id
      user {
        firstName
        surname
        email
        phoneNumber
      }
      siteAddress {
        id
        province {
          id
          description
        }
        name
        addressLine1
        addressLine2
        addressLine3
        postalCode
        ward
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
  mutation updateHealthCareWorker($input: PractitionerInput, $id: UUID) {
    updateHealthCareWorker(id: $id, input: $input) {
      id
    }
  }
`;

export const UploadHealthCareWorkers = gql`
mutation ($file: String) {
  importTeamLeads(file: $file) {
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
mutation ($file: String) {
  importTeamLeads(file: $file) {
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
