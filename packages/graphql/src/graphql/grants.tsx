import { gql } from '@apollo/client';

export const GetAllGrant = gql`
  query GetAllGrant($pagingInput: PagedQueryInput) {
    GetAllGrant(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetGrantById = gql`
  query GetGrantById($id: UUID) {
    GetGrantById(id: $id) {
      id
      description
    }
  }
`;

export const CreateGrant = gql`
  mutation createGrant($input: GrantInput) {
    createGrant(input: $input) {
      id
    }
  }
`;

export const UpdateGrant = gql`
  mutation updateGrant($input: GrantInput, $id: UUID) {
    updateGrant(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteGrant = gql`
  mutation deleteGrant($id: UUID!) {
    deleteGrant(id: $id)
  }
`;
