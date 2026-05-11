import { Config } from '@ecdlink/core';
import {
  MutationDisableNotificationArgs,
  QueryAllNotificationsArgs,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';

class NotificationAsyncService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async disableNotification(
    input: MutationDisableNotificationArgs
  ): Promise<undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { disableNotification: undefined };
      errors?: {};
    }>(``, {
      id: 'disableNotification',
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Disable notification failed - Server connection error');
    }

    return response.data.data.disableNotification;
  }

  async markAsReadNotification(
    input: MutationDisableNotificationArgs
  ): Promise<undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { markAsReadNotification: undefined };
      errors?: {};
    }>(``, {
      id: 'markAsReadNotification',
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Mark as read notification failed - Server connection error'
      );
    }

    return response.data.data.markAsReadNotification;
  }

  async getAllNotifications(
    input: QueryAllNotificationsArgs
  ): Promise<Notification[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allNotifications: Notification[] };
      errors?: {};
    }>(``, {
      id: 'allNotifications',
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

export default NotificationAsyncService;
