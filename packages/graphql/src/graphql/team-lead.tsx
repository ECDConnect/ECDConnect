import { gql } from '@apollo/client';

export const GetAllTeamLead = gql`
  query (
    $search: String
    $clinicSearch: [String]
    $provinceSearch: [String]
    $visitSearch: [String]
    $connectUsageSearch: [String]
    $pagingInput: PagedQueryInput
    $order: [PortalUsersTLModelSortInput!]
  ) {
    allTeamLeads(
      search: $search
      clinicSearch: $clinicSearch
      provinceSearch: $provinceSearch
      visitSearch: $visitSearch
      connectUsageSearch: $connectUsageSearch
      pagingInput: $pagingInput
      order: $order
    ) {
      id
      insertedDate
      user {
        connectUsage
        isActive
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
        lockoutEnd
      }
    }
  }
`;

export const GetAllTeamLeadAdminList = gql`
  query (
    $search: String
    $clinicSearch: String
    $provinceSearch: String
    $pagingInput: PagedQueryInput
    $order: [TeamLeadSortInput!]
  ) {
    allTeamLeads(
      search: $search
      clinicSearch: $clinicSearch
      provinceSearch: $provinceSearch
      pagingInput: $pagingInput
      order: $order
    ) {
      id
      insertedDate
      user {
        isActive
        userName
        email
        idNumber
        fullName
      }
    }
  }
`;

export const CreateTeamLead = gql`
  mutation addTeamLead($input: TeamLeadModelInput) {
    addTeamLead(input: $input) {
      id
    }
  }
`;

export const UploadTeamLeads = gql`
  mutation ($file: String) {
    importTeamLeads(file: $file) {
      validationErrors {
        row
        errors
        errorDescription
      }
      createdUsers
    }
  }
`;

export const TeamLeadsTemplate = gql`
  query {
    teamLeadTemplateGenerator {
      fileType
      base64File
      fileName
      extension
    }
  }
`;

export const GetTeamLead = gql`
  query GetAllTeamLeadById(
    $teamLeadId: UUID
    $fetchImage: Boolean = true
    $fetchClinic: Boolean = true
    $fetchRoles: Boolean = true
  ) {
    GetAllTeamLead(where: { id: { eq: $teamLeadId } }) {
      id
      user {
        isActive
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
        profileImageUrl @include(if: $fetchImage)
        roles @include(if: $fetchRoles) {
          id
          name
        }
      }
    }
  }
`;
