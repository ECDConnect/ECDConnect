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
      areaOfOperation
      secondaryAreaOfOperation
      startDate
    }
  }
`;

export const GetPrincipalById = gql`
  query GetPrincipalById($id: UUID) {
    GetPrincipalById(id: $id) {
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
      isPrincipal
      isTrainee
      isFundaAppAdmin
      coachHierarchy
      principalHierarchy
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
      isPrincipal
      isTrainee
      isFundaAppAdmin
      coachHierarchy
      principalHierarchy
    }
  }
`;

export const CreatePrincipal = gql`
  mutation createPrincipal($input: PrincipalInput) {
    createPrincipal(input: $input) {
      id
    }
  }
`;

export const UpdatePrincipal = gql`
  mutation updatePrincipal($input: PrincipalInput, $id: UUID) {
    updatePrincipal(input: $input, id: $id) {
      id
    }
  }
`;

export const DeletePrincipal = gql`
  mutation deletePrincipal($id: UUID!) {
    deletePrincipal(id: $id)
  }
`;
