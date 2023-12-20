import { gql } from '@apollo/client';

export const GetAllProvince = gql`
  query GetAllProvince($pagingInput: PagedQueryInput) {
    GetAllProvince(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetProvinceById = gql`
  query GetProvinceById($id: UUID) {
    GetProvinceById(id: $id) {
      id
      description
    }
  }
`;

export const CreateProvince = gql`
  mutation createProvince($input: ProvinceInput) {
    createProvince(input: $input) {
      id
    }
  }
`;

export const UpdateProvince = gql`
  mutation updateProvince($input: ProvinceInput, $id: UUID) {
    updateProvince(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteProvince = gql`
  mutation deleteProvince($id: UUID!) {
    deleteProvince(id: $id)
  }
`;
