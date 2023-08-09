import { gql } from '@apollo/client';

export const GetAllProgressTrackingLevel = gql`
  {
    GetAllProgressTrackingLevel {
      id
      title
      description
      imageUrl
      imageUrlDim
      imageUrlDone
    }
  }
`;

export const GetProgressTrackingLevelId = gql`
  query GetProgressTrackingLevelId($id: UUID) {
    GetProgressTrackingLevelId(id: $id) {
      id
      title
      description
      imageUrl
      imageUrlDim
      imageUrlDone
    }
  }
`;

export const CreateProgressTrackingLevel = gql`
  mutation createProgressTrackingLevel($input: ProgressTrackingLevelInput) {
    createProgressTrackingLevel(input: $input) {
      id
    }
  }
`;

export const UpdateProgressTrackingLevel = gql`
  mutation updateProgressTrackingLevel(
    $input: ProgressTrackingLevelInput
    $id: UUID
  ) {
    updateProgressTrackingLevel(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteProgressTrackingLevel = gql`
  mutation deleteProgressTrackingLevel($id: UUID!) {
    deleteProgressTrackingLevel(id: $id)
  }
`;
