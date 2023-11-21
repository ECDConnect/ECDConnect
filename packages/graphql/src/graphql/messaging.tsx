import { gql } from '@apollo/client';

export const MessageList = gql`
  query GetAllMessageLogsForAdmin($userId: String) {
    allMessageLogsForAdmin(userId: $userId) {
      message
      subject
      messageDate
      messageEndDate
      status
      toGroups
    }
  }
`;

export const SaveMessagesForAdmin = gql`
  mutation SaveMessagesForAdmin($input: MessageLogModelInput) {
    saveMessagesForAdmin(input: $input) {
      message
      subject
      messageDate
      messageEndDate
      status
      toGroups
    }
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
