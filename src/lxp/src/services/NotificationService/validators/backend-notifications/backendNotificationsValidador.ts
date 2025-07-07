import { Message, MessageViewType } from '@models/messages/messages';
import {
  NotificationIntervals,
  NotificationValidator,
} from '../../NotificationService.types';
import { Config, RoleSystemNameEnum, UserDto } from '@ecdlink/core';
import { Notification, QueryAllNotificationsArgs } from '@ecdlink/graphql';
import { api } from '@/services/axios.helper';
import {
  MessageStatusConstants,
  notificationTagConfig,
} from '@/constants/notifications';
import { Colours } from '@ecdlink/ui';

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

  getNotifications = async () => {
    if (!this.user?.id) return [];

    const notifications: Message[] = [];

    const allNotifications = await this.getAllNotifications({
      userId: this.user?.id,
    });

    if (!allNotifications.length) return;

    for (const notification of allNotifications) {
      const notificationConfig = this.getNotificationConfig(notification?.cTA);

      const viewType = this.getViewType(notification?.messageProtocol ?? '');

      // Ensure that future messages don't display here
      if (
        new Date(notification.messageDate).getTime() <= new Date().getTime()
      ) {
        notifications.push({
          ...notificationConfig,
          isFromBackend: true,
          reference: notification.id,
          title: notification?.subject ?? '',
          message: notification.message ?? '',
          dateCreated: notification.messageDate,
          priority: notification?.ordering,
          viewOnDashboard:
            notificationConfig?.viewOnDashboard || viewType === 'Hub',
          actionText: notification.cTAText ?? '',
          cta: notification.cTA ?? '',
          icon: notificationConfig?.icon || 'ArrowCircleRightIcon',
          color:
            notificationConfig?.color ||
            this.getMessagesColor(notification?.status ?? ''),
          viewType: notificationConfig?.viewType || viewType,
          area:
            notificationConfig?.area || this.getDefaultArea(this.user ?? {}),
          expiryDate: notification.messageEndDate,
          action: notification.action ?? '',
        });
      }
    }

    return notifications;
  };

  getMessagesColor = (status: string): Colours => {
    switch (status) {
      case MessageStatusConstants.Red:
        return 'errorMain';
      case MessageStatusConstants.Amber:
        return 'alertMain';
      case MessageStatusConstants.Green:
        return 'successMain';
      default:
        return 'infoMain';
    }
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
    const isCoach = user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Coach
    );

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
            ordering
            messageTemplate
              {
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

      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      return [];
    }
    return response.data.data.allNotifications;
  }
}
