import { gql } from '@apollo/client';

export const allCaregiver = gql`
  {
    GetAllCaregiver {
      id
      relation {
        id
        description
      }
      education {
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
      grants {
        id
        description
      }
      user {
        id
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
      }
      emergencyContactFirstName
      emergencyContactSurname
      emergencyContactPhoneNumber
      additionalFirstName
      additionalSurname
      additionalPhoneNumber
      joinReferencePanel
      contribution
    }
  }
`;

export const GetCaregiverById = gql`
  query GetCaregiverById($id: UUID) {
    GetCaregiverById(id: $id) {
      id
      user {
        firstName
        surname
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
      relation {
        id
        description
      }
      education {
        id
        description
      }
      emergencyContactFirstName
      emergencyContactSurname
      emergencyContactPhoneNumber
      additionalFirstName
      additionalSurname
      additionalPhoneNumber
      joinReferencePanel
      contribution
      grants {
        id
        description
      }
    }
  }
`;

export const CreateCaregiver = gql`
  mutation createCaregiver($input: CaregiverInput) {
    createCaregiver(input: $input) {
      id
    }
  }
`;

export const UpdateCaregiver = gql`
  mutation updateCaregiver($input: CaregiverInput, $id: UUID) {
    updateCaregiver(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteCaregiver = gql`
  mutation deleteCaregiver($id: UUID!) {
    deleteCaregiver(id: $id)
  }
`;
