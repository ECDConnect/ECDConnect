import { gql } from '@apollo/client';

export const MessageList = gql`
  query GetAllMessageLogsForAdmin($userId: String) {
    allMessageLogsForAdmin(userId: $userId) {
      message
      subject
      messageDate
      status
      toGroups
      provinceId
      wardName
      districtId
      roleIds
      roleNames
    }
  }
`;

export const GetAllWards = gql`
  query GetAllWards {
    allWards {
      provinceId
      ward
    }
  }
`;

export const SaveBulkMessagesForAdmin = gql`
  mutation SaveBulkMessagesForAdmin($input: MessageLogModelInput) {
    saveBulkMessagesForAdmin(input: $input)
  }
`;

export const GetUserCountForMessageCriteria = gql`
  query GetUserCountForMessageCriteria(
    $provinceId: String
    $districtId: String
    $wardName: String
    $roleIds: [String]
  ) {
    userCountForMessageCriteria(
      provinceId: $provinceId
      districtId: $districtId
      wardName: $wardName
      roleIds: $roleIds
    )
  }
`;
