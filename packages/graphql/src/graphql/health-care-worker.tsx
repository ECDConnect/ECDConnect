import { gql } from '@apollo/client';

export const GetAllHealthCareWorker = gql`
  {
    GetAllHealthCareWorker {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
      }
    }
  }
`;

export const GetHealthCareWorkerByUserId = gql`
  query GetHealthCareWorkerByUserId($id: UUID) {
    GetHealthCareWorkerByUserId(id: $id) {
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
