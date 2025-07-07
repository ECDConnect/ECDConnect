import { gql } from '@apollo/client';

export const allAssociations = gql`
  query allAssociations($userTypeId: Int!) {
    allAssociations(userTypeId: $userTypeId) {
      parentId
      child {
        id
        firstName
        surname
      }
      userType {
        id
        name
      }
    }
  }
`;
