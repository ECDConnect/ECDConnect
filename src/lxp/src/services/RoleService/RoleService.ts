import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { RoleDto } from '@ecdlink/core';
class RoleService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getRoles(): Promise<RoleDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllRoles',
    });

    if (response.status !== 200) {
      throw new Error('Get Roles Failed - Server connection error');
    }

    return response.data.data.roles;
  }
}

export default RoleService;
