import { gql } from '@apollo/client';

export const GenderList = gql`
  query GetAllGender($pagingInput: PagedQueryInput) {
    GetAllGender(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetGenderById = gql`
  query GetGenderById($id: UUID) {
    GetGenderById(id: $id) {
      id
      description
    }
  }
`;

export const CreateGender = gql`
  mutation createGender($input: GenderInput) {
    createGender(input: $input) {
      id
    }
  }
`;

export const UpdateGender = gql`
  mutation updateGender($input: GenderInput, $id: UUID) {
    updateGender(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteGender = gql`
  mutation deleteGender($id: UUID!) {
    deleteGender(id: $id)
  }
`;
