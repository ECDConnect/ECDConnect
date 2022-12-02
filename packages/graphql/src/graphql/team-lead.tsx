import { gql } from '@apollo/client';

export const GetAllTeamLead = gql`
  {
    GetAllTeamLead {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
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
