import { gql } from '@apollo/client';

export const GetThemeRecords = gql`
  query GetThemeRecords(
    $search: String
    $shareContent: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    themeRecords(
      search: $search
      shareContent: $shareContent
      startDate: $startDate
      endDate: $endDate
      pagingInput: $pagingInput
    ) {
      id
      name
      color
      imageUrl
      themeDays
      shareContent
      updatedDate
      themeLogo
      __typename
    }
  }
`;

export const DeleteMultipleThemes = gql`
  mutation DeleteMultipleThemes($contentIds: [String]) {
    deleteMultipleThemes(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
