import { gql } from '@apollo/client';

export const GetAllMothers = gql`
  {
    GetAllMother {
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

export const GetAllMothersForHealthCareWorker = gql`
  query GetAllMothersForHealthCareWorker($id: UUID) {
    GetAllMothersForHealthCareWorker(id: $id) {
      id
      firstName
      surname
      phoneNumber
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

export const AddMother = gql`
  mutation addMother($input: MotherModelInput) {
    addMother(input: $input) {
      id
    }
  }
`;

export const UpdateMother = gql`
  mutation updateMother($id: UUID, $input: MotherModelInput) {
    updateMother(id: $id, input: $input) {
      id
    }
  }
`;
