import { gql } from '@apollo/client';

export const GetAllLanguage = gql`
  query GetAllLanguage($pagingInput: PagedQueryInput) {
    GetAllLanguage(pagingInput: $pagingInput) {
      id
      description
      locale
      isActive
    }
  }
`;

export const GetLanguageById = gql`
  query GetLanguageById($id: UUID) {
    GetLanguageById(id: $id) {
      id
      description
      locale
      isActive
    }
  }
`;

export const CreateLanguage = gql`
  mutation createLanguage($input: LanguageInput) {
    createLanguage(input: $input) {
      id
    }
  }
`;

export const UpdateLanguage = gql`
  mutation updateLanguage($input: LanguageInput, $id: UUID) {
    updateLanguage(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteLanguage = gql`
  mutation deleteLanguage($id: UUID!) {
    deleteLanguage(id: $id)
  }
`;
