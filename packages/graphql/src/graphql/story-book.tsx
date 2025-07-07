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
      isInUse
      inUseThemeNames
      __typename
    }
  }
`;

export const GetStoryBookPartQuestions = gql`
  query GetStoryBookPartQuestions($localeId: UUID!) {
    storyBookPartQuestions(localeId: $localeId) {
      id
      name
      question
      __typename
    }
  }
`;

export const DeleteMultipleStoryBooks = gql`
  mutation DeleteMultipleStoryBooks($contentIds: [String]) {
    deleteMultipleStoryBooks(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
