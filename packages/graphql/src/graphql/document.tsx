import { gql } from '@apollo/client';

export const DocumentList = gql`
  {
    GetAllDocument {
      id
      user {
        firstName
        surname
      }
      userId
      reference
      name
      workflowStatusId
      workflowStatus {
        id
        workflowStatusTypeId
        description
      }
      documentTypeId
      documentType {
        id
        name
        description
      }
    }
  }
`;

export const CreateDocument = gql`
  mutation createDocument($input: DocumentInput) {
    createDocument(input: $input) {
      id
    }
  }
`;

export const UpdateDocument = gql`
  mutation updateDocument($input: DocumentInput, $id: UUID) {
    updateDocument(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteDocument = gql`
  mutation deleteDocument($id: UUID!) {
    deleteDocument(id: $id)
  }
`;
