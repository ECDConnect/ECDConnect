import { gql } from '@apollo/client';

export const GetStoryBookRecords = gql`
  query GetStoryBookRecords(
    $search: String
    $typesSearch: [String]
    $themesSearch: [Int!]
    $languageSearch: [UUID!]
    $shareContent: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    storyBookRecords(
      search: $search
      typesSearch: $typesSearch
      themesSearch: $themesSearch
      languageSearch: $languageSearch
      shareContent: $shareContent
      startDate: $startDate
      endDate: $endDate
      pagingInput: $pagingInput
    ) {
      id
      name
      type
      themes
      updatedDate
      insertedDate
      availableLanguages
      shareContent
      author
      illustrator
      bookLocation
      keywords
      storyBookParts
      __typename
    }
  }
`;

export const DeleteMultipleStoryBooks = gql`
  mutation DeleteMultipleStoryBooks($contentIds: [Int!]) {
    deleteMultipleStoryBooks(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
