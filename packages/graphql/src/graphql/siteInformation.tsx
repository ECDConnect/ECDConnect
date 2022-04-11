import { gql } from '@apollo/client';

export const GetAllSiteInformation = gql`
  {
    GetAllSiteInformation {
      id
      name
      description
    }
  }
`;

export const CreateSiteInformation = gql`
  mutation createSiteInformation($input: SiteInformationInput) {
    createSiteInformation(input: $input) {
      id
    }
  }
`;

export const UpdateSiteInformation = gql`
  mutation updateSiteInformation($input: SiteInformationInput, $id: UUID) {
    updateSiteInformation(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteSiteInformation = gql`
  mutation deleteSiteInformation($id: UUID!) {
    deleteSiteInformation(id: $id)
  }
`;
