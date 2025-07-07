import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { GenderDto } from '@ecdlink/core';
class GenderService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getGenders(): Promise<GenderDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllGender($isActive: Boolean = true){
          GetAllGender (where: { isActive: { eq: $isActive } }){
            id
            description    
            isActive  
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Gender Failed - Server connection error');
    }

    return response.data.data.GetAllGender;
  }
}

export default GenderService;
