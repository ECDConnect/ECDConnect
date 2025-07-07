import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { RaceDto } from '@ecdlink/core';
class RaceService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getRaces(): Promise<RaceDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllRace($isActive: Boolean = true){
        GetAllRace(where: { isActive: { eq: $isActive } }) {
          id
          description      
        }
      }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Races Failed - Server connection error');
    }

    return response.data.data.GetAllRace;
  }
}

export default RaceService;
