import { gql } from '@apollo/client';

export const GetAllProgressTrackingSubCategory = gql`
  {
    GetAllProgressTrackingSubCategory {
      id
      title
      imageUrl
      imageHexColor
      categoryId
      category {
        title
        color
      }
    }
  }
`;

export const GetProgressTrackingSubCategoryId = gql`
  query GetProgressTrackingSubCategoryId($id: UUID) {
    GetProgressTrackingSubCategoryId(id: $id) {
      id
      title
      imageUrl
      categoryId
      category {
        title
      }
    }
  }
`;

export const CreateProgressTrackingSubCategory = gql`
  mutation createProgressTrackingSubCategory(
    $input: ProgressTrackingSubCategoryInput
  ) {
    createProgressTrackingSubCategory(input: $input) {
      id
    }
  }
`;

export const UpdateProgressTrackingSubCategory = gql`
  mutation updateProgressTrackingSubCategory(
    $input: ProgressTrackingSubCategoryInput
    $id: UUID
  ) {
    updateProgressTrackingSubCategory(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteProgressTrackingSubCategory = gql`
  mutation deleteProgressTrackingSubCategory($id: UUID!) {
    deleteProgressTrackingSubCategory(id: $id)
  }
`;
