import { Config, GrantDto } from '@ecdlink/core';
import { api } from '../axios.helper';

class GrantService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getGrants(): Promise<GrantDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllGrant($isActive: Boolean = true) {
        GetAllGrant(where: { isActive: { eq: $isActive } }) {
          id
          description
        }
      }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Grants Failed - Server connection error');
    }
    return response.data.data.GetAllGrant;
  }
}

export default GrantService;
