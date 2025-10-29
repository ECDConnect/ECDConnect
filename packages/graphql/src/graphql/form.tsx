import { gql } from '@apollo/client';

export const UpdatePublishStatus = gql`
  mutation UpdatePublishStatus($contentId: String, $isPublished: String) {
    updatePublishStatus(contentId: $contentId, isPublished: $isPublished)
  }
`;
