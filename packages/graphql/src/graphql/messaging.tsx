import { gql } from '@apollo/client';

export const GetAllMessageLogsForAdmin = gql`
  query GetAllMessageLogsForAdmin(
    $userId: String
    $roleIds: [String]
    $status: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    allMessageLogsForAdmin(
      userId: $userId
      roleIds: $roleIds
      status: $status
      startDate: $startDate
      endDate: $endDate
    ) {
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
      messageLogIds
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
