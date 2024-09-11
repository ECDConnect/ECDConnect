import { gql } from '@apollo/client';

export const GetResources = gql`
  query GetResources(
    $search: String
    $dataFreeSearch: [String]
    $likesSearch: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    resources(
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
      availableLanguages
      updatedDate
      insertedDate
    }
  }
`;
