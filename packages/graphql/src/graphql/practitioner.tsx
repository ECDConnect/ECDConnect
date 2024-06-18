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
        phoneNumber
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
      isPrincipal
      isFundaAppAdmin
      isRegistered
      isTrainee
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      monthSinceFranchisee
      signingSignature
      coachHierarchy
      principalHierarchy
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
      attendedChildProgress
      usePhotoInReport
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
      monthSinceFranchisee
      isPrincipal
      isFundaAppAdmin
      isRegistered
      isTrainee
      signingSignature
      coachHierarchy
      principalHierarchy
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
      attendedChildProgress
      usePhotoInReport
      isCompletedBusinessWalkThrough
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

export const importAll = gql`
  mutation importAll($file: String) {
    importAll(file: $file)
  }
`;

export const importAllChildren = gql`
  mutation importAllChildren($file: String) {
    importAllChildren(file: $file)
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

export const GetAllPortalPractitioners = gql`
  query GetAllPortalPractitioners(
    $search: String
    $provinceSearch: [UUID!]
    $connectUsageSearch: [String]
    $practitionerTypeSearch: [String]
    $pagingInput: PagedQueryInput
    $order: [PortalPractitionerModelSortInput!]
  ) {
    allPortalPractitioners(
      search: $search
      provinceSearch: $provinceSearch
      connectUsageSearch: $connectUsageSearch
      practitionerTypeSearch: $practitionerTypeSearch
      pagingInput: $pagingInput
      order: $order
    ) {
      id
      userId
      isPrincipal
      isFundaAppAdmin
      isRegistered
      user {
        id
        idNumber
        insertedDate
        lastSeen
        firstName
        surname
        fullName
        userName
        phoneNumber
        email
        isActive
        connectUsage
        connectUsageColor
      }
    }
  }
`;

export const PractitionersTemplate = gql`
  query {
    practitionerTemplateGenerator {
      fileType
      base64File
      fileName
      extension
    }
  }
`;
