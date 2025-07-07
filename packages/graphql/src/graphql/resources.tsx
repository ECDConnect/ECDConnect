import { gql } from '@apollo/client';

export const GetResources = gql`
  query GetResources(
    $localeId: UUID!
    $sectionType: String
    $search: String
    $dataFreeSearch: [String]
    $likesSearch: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    resources(
      localeId: $localeId
      sectionType: $sectionType
      search: $search
      dataFreeSearch: $dataFreeSearch
      likesSearch: $likesSearch
      startDate: $startDate
      endDate: $endDate
      pagingInput: $pagingInput
    ) {
      id
      resourceType
      title
      shortDescription
      link
      longDescription
      dataFree
      sectionType
      numberLikes
      availableLanguages {
        id
      }
      updatedDate
      insertedDate
      __typename
    }
  }
`;

export const UpdateResourceTypesAndDataFree = gql`
  mutation UpdateResourceTypesAndDataFree(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $resourceType: String
    $dataFree: String
  ) {
    updateResourceTypesAndDataFree(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      resourceType: $resourceType
      dataFree: $dataFree
    )
  }
`;
