import { gql } from '@apollo/client';

export const GetTenantContext = gql`
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
      moodleUrlVar
    }
  }
`;
