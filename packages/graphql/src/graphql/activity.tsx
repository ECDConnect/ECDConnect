import { gql } from '@apollo/client';

export const GetActivityRecords = gql`
  query GetActivityRecords(
    $isStoryActivity: Boolean!
    $search: String
    $typesSearch: [String]
    $themesSearch: [String]
    $languageSearch: [UUID!]
    $shareContent: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    activityRecords(
      isStoryActivity: $isStoryActivity
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
      materials
      description
      notes
      subType
      type
      themes
      shareContent
      availableLanguages
      subCategories
      updatedDate
      insertedDate
      subTypeItems
      subCategoryItems {
        id
        name
        imageUrl
        imageHexColor
      }
      __typename
    }
  }
`;

export const DeleteMultipleActivities = gql`
  mutation DeleteMultipleActivities($contentIds: [Int!]) {
    deleteMultipleActivities(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
