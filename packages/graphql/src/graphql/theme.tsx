import { gql } from '@apollo/client';

export const UpdateTheme = gql`
  mutation updateTenantTheme($input: String!) {
    updateTenantTheme(theme: $input)
  }
`;
