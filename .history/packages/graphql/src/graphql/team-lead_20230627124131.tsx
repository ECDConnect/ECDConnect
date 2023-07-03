import { gql } from '@apollo/client';

export const GetAllTeamLead = gql`
query ($textSearch: String, $clinicSearch: String, $provinceSearch: String) {
  allTeamLeads(
    textSearch: $textSearch
    clinicSearch: $clinicSearch
    provinceSearch: $provinceSearch
  ) {
    id
    user {
      fullName
      idNumber
      phoneNumber
      email
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
