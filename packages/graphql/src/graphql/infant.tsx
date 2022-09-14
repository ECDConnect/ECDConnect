import { gql } from '@apollo/client';

export const GetAllInfants = gql`
  {
    GetAllInfant {
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

export const GetAllInfantsForMother = gql`
  query GetAllInfantsForMother($id: UUID) {
    GetAllInfantsForMother(id: $id) {
      id
      firstName
      caregiver {
        id
        relation {
          id
          description
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
        user {
          email
          dateOfBirth
          idNumber
          firstName
          surname
          fullName
          genderId
          phoneNumber
          profileImageUrl
        }
      }
    }
  }
`;

export const AddInfant = gql`
  mutation addInfant($input: InfantModelInput) {
    addInfant(input: $input) {
      id
    }
  }
`;

export const UpdateInfant = gql`
  mutation updateInfant($id: UUID, $input: InfantModelInput) {
    updateInfant(id: $id, input: $input) {
      id
    }
  }
`;
