import { gql } from '@apollo/client';

export const GetAllTeamLead = gql`
query ($search: String, $clinicSearch: String, $provinceSearch: String) {
  allTeamLeads(
    search: $search
    clinicSearch: $clinicSearch
    provinceSearch: $provinceSearch
  ) {
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
    profileImageUrl
    roles {
      id
      name
    }
    }
    
      clinic {
        name
        siteAddress {
          province {
            description
          }
        }
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

export const UpdateTeamLead = gql`
  mutation updateTeamLead($input: TeamLeadModelInput, $id: UUID) {
    updateTeamLead(id: $id, input: $input) {
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
    createdUsers {
      id
    }
  }
}
`;

export const TeamLeadsTemplate = gql`
mutation ($file: String) {
  importTeamLeads(file: $file) {
    validationErrors {
      row
      errors
      errorDescription
    }
    createdUsers {
      id
    }
  }
}
`;
