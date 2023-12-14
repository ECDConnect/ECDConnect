import { gql } from '@apollo/client';

export const bulkDeleteCoachingCircleTopics = gql`
  mutation BulkDeleteCoachingCircleTopics($contentIds: [Int!]) {
    bulkDeleteCoachingCircleTopics(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
