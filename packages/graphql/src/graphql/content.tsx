import { gql } from '@apollo/client';

export const GetAllContent = gql`
  {
    GetAllContent {
      id
      name
      reference
      contentType {
        id
        name
        description
        contentGroup {
          name
          description
        }
      }
    }
  }
`;

export const GetContentById = gql`
  query GetContentById($id: UUID) {
    GetContentById(id: $id) {
      id
      name
      reference
      contentType {
        id
        name
        description
      }
    }
  }
`;

export const GetContentForGroup = gql`
  query contentForGroup($group: String, $locale: String) {
    contentForGroup(group: $group, locale: $locale) {
      content
      reference
      contentType
    }
  }
`;

export const CreateContent = gql`
  mutation createContent($input: ContentInput) {
    createContent(input: $input) {
      id
    }
  }
`;

export const InsertContent = gql`
  mutation insertContent(
    $input: ContentInput
    $contentData: String
    $locale: String
    $isVariant: Boolean!
  ) {
    insertContent(
      input: $input
      contentData: $contentData
      locale: $locale
      isVariant: $isVariant
    ) {
      id
    }
  }
`;

export const UpdateContent = gql`
  mutation updateContent(
    $input: ContentInput
    $id: UUID!
    $contentData: String
    $locale: String
  ) {
    updateContent(
      input: $input
      id: $id
      contentData: $contentData
      locale: $locale
    ) {
      id
    }
  }
`;

export const DeleteContent = gql`
  mutation deleteContent($id: UUID!) {
    deleteContent(id: $id)
  }
`;

export const UpdateSubCategorySkills = gql`
  mutation UpdateSubCategorySkills(
    $subCategories: [ProgressSubCategoryModelInput]
    $localeId: UUID!
  ) {
    updateSubCategorySkills(subCategories: $subCategories, localeId: $localeId)
  }
`;

export const UpdateStoryBookAndParts = gql`
  mutation UpdateStoryBookAndParts(
    $storyBookParts: [StoryBookModelInput]
    $storyBookContentId: Int!
    $localeId: UUID!
    $currentBookPartsIds: String!
  ) {
    updateStoryBookAndParts(
      storyBookParts: $storyBookParts
      storyBookContentId: $storyBookContentId
      localeId: $localeId
      currentBookPartsIds: $currentBookPartsIds
    )
  }
`;

export const BulkUpdateConsentImages = gql`
  mutation BulkUpdateConsentImages(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $imageUrl: String
  ) {
    bulkUpdateConsentImages(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      imageUrl: $imageUrl
    )
  }
`;

export const BulkUpdateStoryBookThemes = gql`
  mutation BulkUpdateStoryBookThemes(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $themeIds: String
  ) {
    bulkUpdateStoryBookThemes(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      themeIds: $themeIds
    )
  }
`;

export const BulkUpdateActivityThemes = gql`
  mutation BulkUpdateActivityThemes(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $themeIds: String
  ) {
    bulkUpdateActivityThemes(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      themeIds: $themeIds
    )
  }
`;

export const BulkUpdateActivitySkills = gql`
  mutation BulkUpdateActivitySkills(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $subCategoryIds: String
  ) {
    bulkUpdateActivitySkills(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      subCategoryIds: $subCategoryIds
    )
  }
`;

export const BulkUpdateActivityShareContent = gql`
  mutation BulkUpdateActivityShareContent(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $shareContent: String
  ) {
    bulkUpdateActivityShareContent(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      shareContent: $shareContent
    )
  }
`;

export const BulkUpdateActivityStoryTypes = gql`
  mutation BulkUpdateActivityStoryTypes(
    $contentId: Int!
    $contentTypeId: Int!
    $localeId: UUID!
    $subType: String
  ) {
    bulkUpdateActivityStoryTypes(
      contentId: $contentId
      contentTypeId: $contentTypeId
      localeId: $localeId
      subType: $subType
    )
  }
`;

export const DeleteMultipleResources = gql`
  mutation DeleteBulkResources($contentIds: [Int!]) {
    deleteBulkResources(contentIds: $contentIds) {
      success
      failed
    }
  }
`;
