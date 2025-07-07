import { gql } from '@apollo/client';

export const UpdateTheme = gql`
  mutation updateTenantTheme($input: String!) {
    updateTenantTheme(theme: $input)
  }
`;

export const UpdateTenantInfo = gql`
  mutation UpdateTenantInfo($input: TenantInfoInputModelInput) {
    updateTenantInfo(input: $input) {
      applicationName
      organisationName
      organisationEmail
    }
  }
`;

export const GetDefaultSettingsForTenant = gql`
  query {
    defaultSettingsForTenant
  }
`;

export const RevertTenantSettingsToDefault = gql`
  mutation {
    revertTenantSettingsToDefault
  }
`;
