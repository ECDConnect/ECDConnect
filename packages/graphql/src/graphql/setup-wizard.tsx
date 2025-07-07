import { gql } from '@apollo/client';

export const verifyUrl = gql`
  query ValidateNewTenantName($applicationName: String!) {
    validateNewTenantName(applicationName: $applicationName) {
      true
    }
  }
`;
