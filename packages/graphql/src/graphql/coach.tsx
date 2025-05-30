import { gql } from '@apollo/client';

export const GetAllCoach = gql`
  {
    GetAllCoach {
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
      areaOfOperation
      secondaryAreaOfOperation
      startDate
    }
  }
`;

export const GetCoachById = gql`
  query GetCoachById($id: UUID) {
    GetCoachById(id: $id) {
      areaOfOperation
      secondaryAreaOfOperation
      startDate
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
    }
  }
`;

export const CreateCoach = gql`
  mutation createCoach($input: CoachInput) {
    createCoach(input: $input) {
      id
    }
  }
`;

export const UpdateCoach = gql`
  mutation updateCoach($input: CoachInput, $id: UUID) {
    updateCoach(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteCoach = gql`
  mutation deleteCoach($id: UUID!) {
    deleteCoach(id: $id)
  }
`;

export const GetAllPortalCoaches = gql`
  query GetAllPortalCoaches(
    $search: String
    $connectUsageSearch: [String]
    $pagingInput: PagedQueryInput
    $order: [PortalCoachModelSortInput!]
  ) {
    allPortalCoaches(
      search: $search
      connectUsageSearch: $connectUsageSearch
      pagingInput: $pagingInput
      order: $order
    ) {
      id
      userId
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

export const CoachesTemplate = gql`
  query {
    coachTemplateGenerator {
      fileType
      base64File
      fileName
      extension
    }
  }
`;

export const UploadCoaches = gql`
  mutation ($file: String) {
    importCoaches(file: $file) {
      validationErrors {
        row
        errors
        errorDescription
      }
      createdUsers
    }
  }
`;

export const GetCoachStats = gql`
  query GetCoachStats(
    $userId: UUID!
    $startDate: DateTime!
    $endDate: DateTime
  ) {
    coachStats(userId: $userId, startDate: $startDate, endDate: $endDate) {
      totalPractitioners
      totalNewPractitioners
      totalSiteVisits
      totalWithNoIncomeExpense
      totalWithIncomeExpense
      totalLessThan75AttendanceRegisters
      totalMoreThan75hAttendanceRegisters
      totalWithNoProgressReports
      totalWithProgressReports
    }
  }
`;
