import { gql } from '@apollo/client';

export const GetAllFranchisor = gql`
  {
    GetAllFranchisor {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
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
      areaOfOperation
      secondaryAreaOfOperation
      startDate
    }
  }
`;

export const GetFranchisorById = gql`
  query GetFranchisorById($id: UUID) {
    GetFranchisorById(id: $id) {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
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
      areaOfOperation
      secondaryAreaOfOperation
      startDate
    }
  }
`;

export const CreateFranchisor = gql`
  mutation createFranchisor($input: FranchisorInput) {
    createFranchisor(input: $input) {
      id
    }
  }
`;

export const UpdateFranchisor = gql`
  mutation updateFranchisor($input: FranchisorInput, $id: UUID) {
    updateFranchisor(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteFranchisor = gql`
  mutation deleteFranchisor($id: UUID!) {
    deleteFranchisor(id: $id)
  }
`;
