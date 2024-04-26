import { gql } from '@apollo/client';

export const GetDangerSignTranslations = gql`
  query GetDangerSignTranslations($section: String, $toTranslate: String) {
    dangerSignTranslation(section: $section, toTranslate: $toTranslate) {
      language
      translation
    }
  }
`;
