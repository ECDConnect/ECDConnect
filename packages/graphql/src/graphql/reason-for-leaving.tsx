import { gql } from '@apollo/client';

export const GetAllReasonForLeaving = gql`
  query GetAllReasonForLeaving($pagingInput: PagedQueryInput) {
    GetAllReasonForLeaving(pagingInput: $pagingInput) {
      id
      description
      isActive
    }
  }
`;

export const GetReasonForLeavingById = gql`
  query GetReasonForLeavingById($id: UUID) {
    GetReasonForLeavingById(id: $id) {
      id
      description
    }
  }
`;

export const CreateReasonForLeaving = gql`
  mutation createReasonForLeaving($input: ReasonForLeavingInput) {
    createReasonForLeaving(input: $input) {
      id
    }
  }
`;

export const UpdateReasonForLeaving = gql`
  mutation updateReasonForLeaving($input: ReasonForLeavingInput, $id: UUID) {
    updateReasonForLeaving(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteReasonForLeaving = gql`
  mutation deleteReasonForLeaving($id: UUID!) {
    deleteReasonForLeaving(id: $id)
  }
`;
