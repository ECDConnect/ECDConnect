import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ProvinceDto } from '@ecdlink/core';
class ProvinceService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProvinces(): Promise<ProvinceDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllProvince($isActive: Boolean = true){
          GetAllProvince(where: { isActive: { eq: $isActive } }) {
            id
            description      
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Provinces Failed - Server connection error');
    }

    return response.data.data.GetAllProvince;
  }
}

export default ProvinceService;
