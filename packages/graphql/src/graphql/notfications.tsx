import { gql } from '@apollo/client';

export const GetAllNotifications = gql`
  query allNotifications($userId: String) {
    allNotifications(userId: $userId) {
      id
      fromUserId
      messageProtocol
      message
      messageTemplateType
      subject
      sentByUserId
      from
      id
      messageDate
      messageEndDate
      readDate
      status
      cTA
      cTAText
      ordering
      messageTemplate {
        id
        ordering
        templateType
        subject
        message
        cTA
        cTAText
        typeCode
      }
      action
    }
  }
`;

export const MarkAsReadNotification = gql`
  mutation markAsReadNotification($id: UUID) {
    markAsReadNotification(id: $id) {
      id
    }
  }
`;
