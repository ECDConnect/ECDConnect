import { gql } from '@apollo/client';

export const GetAllRelation = gql`
  query GetAllRelation($pagingInput: PagedQueryInput) {
    GetAllRelation(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetRelationById = gql`
  query GetRelationById($id: UUID) {
    GetRelationById(id: $Id) {
      id
      description
    }
  }
`;

export const CreateRelation = gql`
  mutation createRelation($input: RelationInput) {
    createRelation(input: $input) {
      id
    }
  }
`;

export const UpdateRelation = gql`
  mutation updateRelation($input: RelationInput, $id: UUID) {
    updateRelation(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteRelation = gql`
  mutation deleteRelation($id: UUID!) {
    deleteRelation(id: $id)
  }
`;
