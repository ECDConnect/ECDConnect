import { gql } from '@apollo/client';

export const GetAllNoteType = gql`
  {
    GetAllNoteType {
      id
      name
      normalizedName
      description
    }
  }
`;

export const GetNoteTypeById = gql`
  query GetNoteTypeById($id: UUID) {
    GetNoteTypeById(id: $id) {
      id
      name
      normalizedName
      description
    }
  }
`;

export const CreateNoteType = gql`
  mutation createNoteType($input: NoteTypeInput) {
    createNoteType(input: $input) {
      id
    }
  }
`;

export const UpdateNoteType = gql`
  mutation updateNoteType($input: NoteTypeInput, $id: UUID) {
    updateNoteType(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteNoteType = gql`
  mutation deleteNoteType($id: UUID!) {
    deleteNoteType(id: $id)
  }
`;
