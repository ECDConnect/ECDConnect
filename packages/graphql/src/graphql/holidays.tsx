import { gql } from '@apollo/client';

export const holidays = gql`
  {
    holidays {
      day
    }
  }
`;
