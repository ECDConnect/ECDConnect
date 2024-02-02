import { gql } from '@apollo/client';

export const GetAllEducation = gql`
  query GetAllEducation($pagingInput: PagedQueryInput) {
    GetAllEducation(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetEducationById = gql`
  query GetEducationById($id: UUID) {
    GetEducationById(id: $id) {
      id
      description
    }
  }
`;

export const CreateEducation = gql`
  mutation createEducation($input: EducationInput) {
    createEducation(input: $input) {
      id
    }
  }
`;

export const UpdateEducation = gql`
  mutation updateEducation($input: EducationInput, $id: UUID) {
    updateEducation(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteEducation = gql`
  mutation deleteEducation($id: UUID!) {
    deleteEducation(id: $id)
  }
`;
