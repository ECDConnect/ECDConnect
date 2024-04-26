import { gql } from '@apollo/client';

export const GetAllTopic = gql`
  query GetAllTopic($localeId: String) {
    GetAllTopic(localeId: $localeId) {
      id
      availableLanguages {
        id
        description
        locale
        isActive
      }
      infoGraphic
      knowledgeContent
      selfCareContent
      title
      topicContent
      topicTitle
      updatedDate
    }
  }
`;
