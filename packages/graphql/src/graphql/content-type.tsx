import { gql } from '@apollo/client';

export const contentTypes = gql`
  query (
    $search: String
    $searchInContent: Boolean
    $isVisiblePortal: Boolean
    $contentTypeIdFilter: [Int!]
    $contentTypeNameFilter: [String!]
  ) {
    contentTypes(
      search: $search
      searchInContent: $searchInContent
      isVisiblePortal: $isVisiblePortal
      showOnlyTypesWithIds: $contentTypeIdFilter
      showOnlyTypesWithName: $contentTypeNameFilter
    ) {
      id
      name
      description
      isActive
      content {
        id
        isActive
        contentValues {
          localeId
          status {
            id
            name
          }
          value
          contentTypeField {
            fieldOrder
            fieldName
            displayName
            displayMainTable
            displayPage
            isRequired
          }
        }
      }
      fields {
        fieldOrder
        fieldName
        fieldType {
          name
          dataType
        }
        dataLinkName
        displayName
        displayMainTable
        displayPage
        isRequired
      }
    }
  }
`;

export const contentTypesWithLanguage = gql`
  query (
    $search: String
    $searchInContent: Boolean
    $isVisiblePortal: Boolean
    $showOnlyTypesWithName: [String!]
    $showOnlyTypesWithIds: [Int!]
    $pagingInput: PagedQueryInput
  ) {
    contentTypesWithLanguages(
      search: $search
      searchInContent: $searchInContent
      isVisiblePortal: $isVisiblePortal
      showOnlyTypesWithName: $showOnlyTypesWithName
      showOnlyTypesWithIds: $showOnlyTypesWithIds
      pagingInput: $pagingInput
    ) {
      id
      name
      description
      isActive
      content {
        id
        isActive
        updatedDate
        contentValues {
          insertedDate
          updatedDate
          localeId
          status {
            id
            name
          }
          value
          contentTypeField {
            fieldOrder
            fieldName
            displayName
            displayMainTable
            displayPage
          }
        }
      }
      fields {
        fieldOrder
        fieldName
        fieldType {
          name
          dataType
        }
        dataLinkName
      }
      languages {
        id
        locale
      }
    }
  }
`;

export const contentDefinitions = gql`
  {
    contentDefinitions {
      contentName
      identifier
      fields {
        name
        dataType
        fieldTypeId
        graphDataTypeName
        assemblyDataTypeName
        displayName
        displayMainTable
        displayPage
        isRequired
      }
    }
  }
`;

export const contentDefinitionsExcelTemplateGenerator = gql`
  query contentDefinitionsExcelTemplateGenerator($contentTypeId: Int!) {
    contentDefinitionsExcelTemplateGenerator(contentTypeId: $contentTypeId) {
      base64File
      fileType
      fileName
      extension
    }
  }
`;

export const contentTypeImport = gql`
  mutation contentTypeImport($contentTypeId: Int!, $file: String) {
    contentTypeImport(contentTypeId: $contentTypeId, file: $file)
  }
`;

export const bulkDeleteContentTypes = gql`
  mutation BulkDeleteContentTypes($contentIds: [Int!]) {
    bulkDeleteContentTypes(contentIds: $contentIds) {
      success
      failed
    }
  }
`;

// export const contentTypeById = gql`
//   query contentTypeById($id: UUID) {
//     contentTypeById(id: $id) {
//       id
//       name
//       description
//       isActive
//       content {
//         id
//         isActive
//         contentValues {
//           localeId
//           status {
//             id
//             name
//           }
//           value
//           contentTypeField {
//             fieldName
//           }
//         }
//       }
//       fields {
//         fieldName
//         fieldType {
//           name
//           dataType
//         }
//       }
//     }
//   }
// `;

// export const CreateContentType = gql`
//   mutation createContentType($input: ContentTypeInput) {
//     createContentType(input: $input) {
//       id
//       name
//       description
//       contentGroupId
//       contentGroup {
//         id
//         name
//         description
//       }
//       contentItems {
//         id
//         name
//         reference
//       }
//     }
//   }
// `;

// export const UpdateContentType = gql`
//   mutation updateContentType($input: ContentTypeInput, $id: UUID) {
//     updateContentType(input: $input, id: $id) {
//       id
//       name
//       description
//       contentGroupId
//       contentGroup {
//         id
//         name
//         description
//       }
//       contentItems {
//         id
//         name
//         reference
//       }
//     }
//   }
// `;

// export const DeleteContentType = gql`
//   mutation deleteContentType($id: UUID!) {
//     deleteContentType(id: $id)
//   }
// `;
