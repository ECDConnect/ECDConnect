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
  mutation createProgressTrackingCategory(
    $input: ProgressTrackingCategoryInput
  ) {
    createProgressTrackingCategory(input: $input) {
      id
    }
  }
`;

export const UpdateProgressTrackingCategory = gql`
  mutation updateProgressTrackingCategory(
    $input: ProgressTrackingCategoryInput
    $id: UUID
  ) {
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

export const bulkUpdateProgressTrackingCategoryImages = gql`
  mutation BulkUpdateProgressTrackingCategoryImages(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $imageUrl: String
  ) {
    bulkUpdateProgressTrackingCategoryImages(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      imageUrl: $imageUrl
    )
  }
`;

export const bulkUpdateProgressTrackingSubCategoryImages = gql`
  mutation BulkUpdateProgressTrackingSubCategoryImages(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $imageUrl: String
  ) {
    bulkUpdateProgressTrackingSubCategoryImages(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      imageUrl: $imageUrl
    )
  }
`;
