import { gql } from '@apollo/client';

export const GetAllPractitioner = gql`
  {
    GetAllPractitioner {
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
      isPrincipal
      isTrainee
      isFundaAppAdmin
      coachHierarchy
      principalHierarchy
      NotInvitedYet
    }
  }
`;

export const GetPractitionerById = gql`
  query GetPractitionerById($id: UUID) {
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
      isPrincipal
      isTrainee
      isFundaAppAdmin
      coachHierarchy
      principalHierarchy
      NotInvitedYet
    }
  }
`;

export const GetPractitionerByIdNumber = gql`
  query GetPractitionerByIdNumber($idNumber: String) {
    GetPractitionerByIdNumber(idNumber: $idNumber) {
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
      NotInvitedYet
    }
  }
`;

export const CreatePractitioner = gql`
  mutation createPractitioner($input: PractitionerInput) {
    createPractitioner(input: $input) {
      id
    }
  }
`;

export const UpdatePractitioner = gql`
  mutation updatePractitioner($input: PractitionerInput, $id: UUID) {
    updatePractitioner(input: $input, id: $id) {
      id
    }
  }
`;

export const DeletePractitioner = gql`
  mutation deletePractitioner($id: UUID!) {
    deletePractitioner(id: $id)
  }
`;

export const practitionerImport = gql`
  mutation practitionerImport($file: String) {
    practitionerImport(file: $file)
  }
`;

export const practitionerExcelTemplateGenerator = gql`
  query {
    practitionerExcelTemplateGenerator {
      base64File
      fileType
      fileName
      extension
    }
  }
`;
