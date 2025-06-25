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
      isPrincipal
      isRegistered
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      signingSignature
      coachHierarchy
      principalHierarchy
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
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
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      isPrincipal
      isRegistered
      signingSignature
      coachHierarchy
      principalHierarchy
      isLeaving
      dateLinked
      dateToBeRemoved
      dateAccepted
      progress
      usePhotoInReport
      isCompletedBusinessWalkThrough
      permissions {
        id
        isActive
        permissionId
        permissionName
        permissionNormalizedName
        permissionGrouping
      }
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

export const UploadPractitioners = gql`
  mutation ($file: String) {
    importPractitioners(file: $file) {
      validationErrors {
        row
        errors
        errorDescription
      }
      createdUsers
    }
  }
`;

export const ValidatePractitionerImportSheet = gql`
  query ValidatePractitionerImportSheet($file: String) {
    validatePractitionerImportSheet(file: $file) {
      validationErrors {
        row
        errors
        errorDescription
        __typename
      }
    }
  }
`;

export const GetPractitionerByUserId = gql`
  query GetPractitionerByUserId($userId: String) {
    practitionerByUserId(userId: $userId) {
      id
      userId
      user {
        gender {
          description
        }
        firstName
        surname
        fullName
        userName
        email
        isSouthAfricanCitizen
        verifiedByHomeAffairs
        idNumber
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
      programmeType
      isPrincipal
      isRegistered
      principalHierarchy
      coachHierarchy
      coachName
      attendanceRegisterLink
      consentForPhoto
      parentFees
      languageUsedInGroups
      signingSignature
      startDate
      shareInfo
      dateLinked
      dateAccepted
      dateToBeRemoved
      isLeaving
      progress
      usePhotoInReport
      isCompletedBusinessWalkThrough
      clickedCommunityTab
      communitySectionViewDate
      absentees {
        absentDate
        absentDateEnd
        className
        classroomGroupId
        reason
        reassignedToPerson
        reassignedToUserId
        absenteeId
        loggedByPerson
        loggedByUserId
      }
      permissions {
        id
        userId
        permissionId
        isActive
        permissionName
        permissionNormalizedName
        permissionGrouping
      }
    }
  }
`;

export const GetPractitionerPermissions = gql`
  query GetPractitionerPermissions($userId: String) {
    practitionerPermissions(userId: $userId) {
      id
      permissions {
        id
        userId
        permissionId
        isActive
        permissionName
        permissionNormalizedName
        permissionGrouping
      }
    }
  }
`;

export const GetPractitionerStats = gql`
  query GetPractitionerStats(
    $userId: UUID!
    $startDate: DateTime!
    $endDate: DateTime
  ) {
    practitionerStats(
      userId: $userId
      startDate: $startDate
      endDate: $endDate
    ) {
      schoolName
      totalPractitionersForSchool
      totalChildrenForSchool
      totalClassesForSchool
      totalAttendanceRegistersCompleted
      totalAttendanceRegistersNotCompleted
      totalProgressReportsCompleted
      totalProgressReportsNotCompleted
      totalIncomeStatementsDownloaded
      totalIncomeStatementsWithNoItems
    }
  }
`;
