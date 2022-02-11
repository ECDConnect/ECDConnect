import { gql } from '@apollo/client';

export const GetAllProgressTrackingCategory = gql`
  {
    GetAllProgressTrackingCategory {
      id
      title
      subTitle
      description
      imageUrl
      color
    }
  }
`;

export const GetProgressTrackingCategoryId = gql`
  query GetProgressTrackingCategoryId($id: UUID) {
    GetProgressTrackingCategoryId(id: $id) {
      id
      title
      subTitle
      description
      imageUrl
      color
    }
  }
`;

export const CreateProgressTrackingCategory = gql`
  mutation createProgressTrackingCategory($input: ProgressTrackingCategoryInput) {
    createProgressTrackingCategory(input: $input) {
      id      
    }
  }
`;

export const UpdateProgressTrackingCategory = gql`
  mutation updateProgressTrackingCategory($input: ProgressTrackingCategoryInput, $id: UUID) {
    updateProgressTrackingCategory(input: $input, id: $id) {
      id      
    }
  }
`;

export const DeleteProgressTrackingCategory = gql`
  mutation deleteProgressTrackingCategory($id: UUID!) {
    deleteProgressTrackingCategory(id: $id)
  }
`;
