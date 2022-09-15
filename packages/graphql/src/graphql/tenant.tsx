import { gql } from '@apollo/client';

export const GetTenantContext = gql`
  {
    tenantContext {
      applicationName
    }
  }
`;
