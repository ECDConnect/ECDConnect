import { Config } from '@ecdlink/core';
import { MutationDisableNotificationArgs } from '@ecdlink/graphql';
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
      query: `
        mutation disableNotification($notificationId: String!) {          
          disableNotification(notificationId: $notificationId) {}        
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Disable notification failed - Server connection error');
    }

    return response.data.data.disableNotification;
  }
}

export default NotificationAsyncService;
