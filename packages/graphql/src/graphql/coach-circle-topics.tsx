import { gql } from '@apollo/client';

export const bulkDeleteCoachingCircleTopics = gql`
  mutation BulkDeleteCoachingCircleTopics($contentIds: [Int!]) {
    bulkDeleteCoachingCircleTopics(contentIds: $contentIds) {
      success
      failed
    }
  }
`;

export const bulkUpdateCoachingCircleTopicDates = gql`
  mutation BulkUpdateCoachingCircleTopicDates(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $startDate: DateTime!
    $endDate: DateTime
  ) {
    bulkUpdateCoachingCircleTopicDates(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      startDate: $startDate
      endDate: $endDate
    )
  }
`;
