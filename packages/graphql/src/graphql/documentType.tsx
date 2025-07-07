import { gql } from '@apollo/client';

export const DocumentTypeList = gql`
  {
    GetAllDocumentType {
      id
      name
      descriptions
    }
  }
`;

export const GetDocumentTypesById = gql`
  query GetDocumentTypeById($id: UUID) {
    GetDocumentTypeById(id: $id) {
      id
      name
      descriptions
    }
  }
`;

export const CreateDocumentType = gql`
  mutation createDocumentType($input: DocumentTypeInput) {
    createDocumentType(input: $input) {
      id
    }
  }
`;

export const UpdateDocumentType = gql`
  mutation updateDocumentType($input: DocumentTypeInput, $id: UUID) {
    updateDocumentType(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteDocumentType = gql`
  mutation deleteDocumentType($id: UUID!) {
    deleteDocumentType(id: $id)
  }
`;
