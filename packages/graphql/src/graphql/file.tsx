import { gql } from '@apollo/client';

export const FileUpload = gql`
  mutation fileUpload(
    $file: String
    $fileName: String
    $fileType: FileTypeEnum!
  ) {
    fileUpload(file: $file, fileName: $fileName, fileType: $fileType) {
      name
      reference
      url
    }
  }
`;
