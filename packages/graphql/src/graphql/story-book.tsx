import { gql } from '@apollo/client';

export const GetStoryBookRecords = gql`
  query GetStoryBookRecords(
    $search: String
    $typesSearch: [String]
    $themesSearch: [String]
    $skillsSearch: [String]
    $languageSearch: [UUID!]
    $startDate: DateTime
    $endDate: DateTime
    $shareContent: String
    $pagingInput: PagedQueryInput
  ) {
    storyBookRecords(
      search: $search
      typesSearch: $typesSearch
      themesSearch: $themesSearch
      skillsSearch: $skillsSearch
      languageSearch: $languageSearch
      startDate: $startDate
      endDate: $endDate
      pagingInput: $pagingInput
      shareContent: $shareContent
    ) {
      id
      name
      type
      themes
      updatedDate
      insertedDate
      availableLanguages
      shareContent
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
