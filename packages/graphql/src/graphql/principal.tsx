import { gql } from '@apollo/client';

export const GetAllPrincipal = gql`
  {
    GetAllPrincipal {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
      }
      siteAddressId
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
      attendanceRegisterLink
      maxChildren
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      monthSinceFranchisee
    }
  }
`;

export const GetPrincipalByUserId = gql`
  query GetPrincipalByUserId($id: UUID) {
    GetPrincipalByUserId(userId: $id) {
      id
      user {
        firstName
        surname
        email
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
      attendanceRegisterLink
      maxChildren
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      monthSinceFranchisee
    }
  }
`;

export const GetPrincipalById = gql`
  query GetPrincipalById($id: UUID) {
    GetPractitionerById(id: $id) {
      id
      user {
        firstName
        surname
        email
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
      attendanceRegisterLink
      maxChildren
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      monthSinceFranchisee
    }
  }
`;

export const CreatePrincipal = gql`
  mutation createPrincipal($input: PrincipalInput) {
    createPractitioner(input: $input) {
      id
    }
  }
`;

export const UpdatePrincipal = gql`
  mutation updatePrincipal($input: PrincipalInput, $id: UUID) {
    updatePractitioner(input: $input, id: $id) {
      id
    }
  }
`;

export const DeletePrincipal = gql`
  mutation deletePrincipal($id: UUID!) {
    deletePractitioner(id: $id)
  }
`;

export const principalImport = gql`
  mutation principalImport($file: String) {
    principalImport(file: $file)
  }
`;
