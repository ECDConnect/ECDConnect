import { Config, UserFlagDto } from '@ecdlink/core';
import { api } from '../axios.helper';

class UserFlagService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getUserFlags(): Promise<UserFlagDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'userFlags',
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch user flags - Server connection error');
    }

    return response.data.data.userFlags ?? [];
  }

  async setUserFlag(key: string, value?: string | null): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'setUserFlag',
      variables: {
        key,
        value: value ?? null,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to set user flag - Server connection error');
    }

    return response.data.data.setUserFlag;
  }
}

export default UserFlagService;
