import { gql } from '@apollo/client';

export const GetActivityRecords = gql`
  query GetActivityRecords(
    $isStoryActivity: Boolean!
    $search: String
    $subTypesSearch: [String]
    $typesSearch: [String]
    $themesSearch: [Int!]
    $skillSearch: [Int!]
    $languageSearch: [UUID!]
    $shareContent: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    activityRecords(
      isStoryActivity: $isStoryActivity
      search: $search
      subTypesSearch: $subTypesSearch
      typesSearch: $typesSearch
      themesSearch: $themesSearch
      skillSearch: $skillSearch
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
      image
      isInUse
      inUseThemeNames
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
  mutation DeleteMultipleActivities($contentIds: [String]) {
    deleteMultipleActivities(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
