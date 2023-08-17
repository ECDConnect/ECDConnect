import { gql } from '@apollo/client';

export const DocumentList = gql`
  query GetAllDocuments(
    $showOnlyTypes: [String]
    $userId: String
    $order: [DocumentSortInput!]
    $pagingInput: PagedQueryInput
  ) {
    allDocument(
      showOnlyTypes: $showOnlyTypes
      userId: $userId
      order: $order
      pagingInput: $pagingInput
    ) {
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
      insertedDate
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
