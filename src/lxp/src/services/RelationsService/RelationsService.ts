import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { RelationDto } from '@ecdlink/core';
class RelationsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getRelations(): Promise<RelationDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllRelation($isActive: Boolean = true){
        GetAllRelation(where: { isActive: { eq: $isActive } }) {
          id
          description
        }
      }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Relations Failed - Server connection error');
    }

    return response.data.data.GetAllRelation;
  }
}

export default RelationsService;
