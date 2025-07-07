import { gql } from '@apollo/client';

export const GetAllPrincipal = gql`
  {
    allPrincipal {
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
      isPrincipal
      isRegistered
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      signingSignature
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
      usePhotoInReport
    }
  }
`;

export const allPrincipal = gql`
  {
    allPrincipal {
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
      isPrincipal
      isRegistered
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
      usePhotoInReport
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
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      isPrincipal
      isRegistered
      signingSignature
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
      usePhotoInReport
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

export const UpdatePrincipalInvitation = gql`
  mutation updatePrincipalInvitation(
    $practitionerId: String
    $principalId: String
    $accepted: Boolean!
  ) {
    updatePrincipalInvitation(
      practitionerId: $practitionerId
      principalId: $principalId
      accepted: $accepted
    ) {
      leavingDate
      acceptedDate
      linkedDate
      leaving
    }
  }
`;
