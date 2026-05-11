import { Config, UserConsentDto, UserDto } from '@ecdlink/core';
import {
  UserByToken,
  UserConsentInput,
  UserModelInput,
  UserSyncStatus,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';

class UserService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getUser(): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'userCurrent',
    });

    if (response.status !== 200) {
      throw new Error('Get Users Failed - Server connection error');
    }

    return response.data.data.userById;
  }

  async getUserConsents(userId: string): Promise<UserConsentDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'getAllUserConsent',
      variables: {
        createdUserId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Getting GetAllUserConsent failed - Server connection error'
      );
    }

    return response.data.data.GetAllUserConsent;
  }

  async updateUserConsents(
    id: string,
    input: UserConsentInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateUserConsent',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating UserConsent failed - Server connection error');
    }

    return true;
  }

  async resetUserPassword(
    userId: string,
    newPassword: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'resetUserPassword',
      variables: {
        id: userId,
        newPassword: newPassword,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Resetting User Password failed - Server connection error'
      );
    }

    return true;
  }

  async getUserSyncStatus(
    lastSyncDate: Date,
    classroomId: string
  ): Promise<UserSyncStatus> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'getUserSyncStatus',
      variables: {
        lastSync: lastSyncDate,
        classroomId: classroomId,
      },
    });

    if (response.status !== 200) {
      throw new Error('User Sync Status failed - Server connection error');
    }

    return response.data.data.userSyncStatus;
  }

  async updateUser(userId: string, user: UserModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateUser',
      variables: {
        id: userId,
        input: user,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating User failed - Server connection error');
    }

    return true;
  }

  async addUser(user: UserModelInput): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'addUser',
      variables: {
        input: user,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating User failed - Server connection error');
    }

    return response.data.data.addUser;
  }

  async getUserByToken(token: string): Promise<UserByToken> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'userByToken',
      variables: {
        token: token,
      },
    });

    if (response.status !== 200) {
      throw new Error('Cannot retrieve usre by token');
    }

    return response.data.data.userByToken;
  }
}

export default UserService;
