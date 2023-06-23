import { gql } from '@apollo/client';

export const GetAllTeamLead = gql`
query($search: String, $provinceSearch: String) {
  GetAllTeamLead(
     where: {
       user: { or: [
         { fullName: {contains: $search} }
         { idNumber: {contains: $search} }
         { email: {contains: $search} }
         ]
       }
       clinic: {
         siteAddress: { 
           province: { description: { eq: $provinceSearch } } }
       }
     },
  ) {
    id
    user {
       fullName
       idNumber
        phoneNumber
        email
    }
    clinic {
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
