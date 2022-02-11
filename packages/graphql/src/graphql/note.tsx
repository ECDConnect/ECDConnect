import { gql } from '@apollo/client';

export const GetAllNote = gql`
  {
    GetAllNote {
      id
      name
      bodyText
      noteTypeId
      userId
      user {
        firstName
        surname
      }
      insertedDate
    }
  }
`;

export const GetNoteById = gql`
  query GetNoteById($id: UUID) {
    GetNoteById(id: $id) {
      id
      name
      bodyText
      noteTypeId
      userId
      user {
        firstName
        surname
      }
      insertedDate
    }
  }
`;

export const CreateNote = gql`
  mutation createNote($input: NoteInput) {
    createNote(input: $input) {
      id
    }
  }
`;

export const UpdateNote = gql`
  mutation updateNote($input: NoteInput, $id: UUID) {
    updateNote(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteNote = gql`
  mutation deleteNote($id: UUID!) {
    deleteNote(id: $id)
  }
`;
