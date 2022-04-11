import { gql } from '@apollo/client';

export const CreateSiteAddress = gql`
  mutation createSiteAddress($input: SiteAddressInput) {
    createSiteAddress(input: $input) {
      id
    }
  }
`;

export const UpdateSiteAddress = gql`
  mutation updateSiteAddress($id: UUID!, $input: SiteAddressInput) {
    updateSiteAddress(id: $id, input: $input) {
      id
    }
  }
`;

export const DeleteSiteAddress = gql`
  mutation deleteSiteAddress($id: UUID!) {
    deleteSiteAddress(id: $id)
  }
`;
