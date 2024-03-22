import { gql } from '@apollo/client';

export const GetNatalRecordsForType = gql`
  query GetNatalRecordsForType(
    $contentTypeId: Int!
    $natalType: String!
    $localeId: UUID!
  ) {
    natalRecordsForType(
      contentTypeId: $contentTypeId
      natalType: $natalType
      localeId: $localeId
    ) {
      title
      section
      languages
      childType
      childId
      childContentTypeName
      childContentTypeId
      updatedDate
    }
  }
`;
