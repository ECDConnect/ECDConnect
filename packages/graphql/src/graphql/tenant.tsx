import { gql } from '@apollo/client';

export const TenantContext = gql`
  {
    tenantContext {
      id
      adminSiteAddress
      siteAddress
      applicationName
      organisationName
      tenantType
      themePathVar
      var1
      var2
    }
  }
`;
