import { Message, MessageViewType } from '@models/messages/messages';
import {
  NotificationIntervals,
  NotificationPriority,
  NotificationValidator,
} from '../../NotificationService.types';
import { Config, UserDto } from '@ecdlink/core';
import { Notification, QueryAllNotificationsArgs } from '@ecdlink/graphql';
import { api } from '@/services/axios.helper';
import { notificationTagConfig } from '@/constants/notifications';

export class BackendNotificationsValidator implements NotificationValidator {
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  user?: UserDto;
  _accessToken?: string;

  constructor(accessToken?: string, user?: UserDto) {
    this._accessToken = accessToken;
    this.user = user;
    this.interval = NotificationIntervals.hour;
    this.lastCheckTimestamp = 0;
  }

  // TODO: update type of getNotifications
  // @ts-ignore
  getNotifications = async () => {
    const notifications: Message[] = [];

    const allNotifications = await this.getAllNotifications({
      userId: this.user?.id,
    });

    if (!allNotifications.length) return;

    for (const notification of allNotifications) {
      const notificationConfig = this.getNotificationConfig(notification?.cTA);

      notifications.push({
        ...notificationConfig,
        isFromBackend: true,
        reference: notification.id,
        title: notification?.subject ?? '',
        message: notification.message ?? '',
        dateCreated: notification.messageDate,
        // TODO: get the correct priority from the backend
        priority: NotificationPriority.high,
        viewOnDashboard: true,
        actionText: notification.cTAText ?? '',
        cta: notification.cTA ?? '',
        icon: notificationConfig?.icon || 'ArrowCircleRightIcon',
        color: notificationConfig?.color || 'white',
        viewType: this.getViewType(notification?.messageProtocol ?? ''),
        area: notificationConfig?.area || this.getDefaultArea(this.user ?? {}),
        expiryDate: notification.messageEndDate,
      });
    }

    return notifications;
  };

  getNotificationConfig = (cta: Notification['cTA']) => {
    const formattedCta = cta?.replace(/\[\[|\]\]/g, '') as string;

    return notificationTagConfig[formattedCta];
  };

  getViewType = (messageProtocol?: string): MessageViewType => {
    if (!messageProtocol) return 'None';

    switch (messageProtocol) {
      case 'hub':
        return 'Hub';
      case 'push':
        return 'Messages';
      // TODO: check what the sms and email protocols will return
      default:
        return 'None';
    }
  };

  getDefaultArea = (user: UserDto) => {
    const isCoach = user?.roles?.some((role) => role.name === 'Coach');

    if (isCoach) return 'coach';

    return 'practitioner';
  };

  async getAllNotifications(
    input: QueryAllNotificationsArgs
  ): Promise<Notification[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allNotifications: Notification[] };
      errors?: {};
    }>(``, {
      query: `
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
            status
            cTA
            cTAText
            messageTemplate
              {
                id
                templateType
                subject
                message
                cTA
                cTAText
                typeCode                        
              }
          }
        }

      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('get all notification failed - Server connection error');
    }

    return response.data.data.allNotifications;
  }
}
