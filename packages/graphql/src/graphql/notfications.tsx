import { gql } from '@apollo/client';

export const GetAllNotifications = gql`
  query allNotifications($userId: String, $protocol: String, $inApp: Boolean) {
    allNotifications(userId: $userId, protocol: $protocol, inApp: $inApp) {
      id
      fromUserId
      messageProtocol
      message
      messageTemplateType
      subject
      sentByUserId
      from
      id
      relatedToUserId
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
  mutation MarkAsReadNotification($notificationId: String) {
    markAsReadNotification(notificationId: $notificationId)
  }
`;

export const DisableNotification = gql`
  mutation disableNotification($notificationId: String!) {
    disableNotification(notificationId: $notificationId)
  }
`;
