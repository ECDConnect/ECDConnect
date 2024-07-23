import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { LanguageDto } from '@ecdlink/core';
class LanguageService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getLanguages(): Promise<LanguageDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllLanguage($isActive: Boolean = true){
        GetAllLanguage(where: { isActive: { eq: $isActive } }){
            id
            description
            locale
            isActive
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Languages Failed - Server connection error');
    }
    return response.data.data.GetAllLanguage;
  }

  async getOpenLanguages(): Promise<LanguageDto[]> {
    const apiInstance = api(Config.graphQlApi);
    const response = await apiInstance.post<any>(``, {
      query: `
      query openLanguage(){
        openLanguage(){
            id
            description
            locale
            isActive
        }
      }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Get Open Languages Failed - Server connection error');
    }

    return response.data.data.openLanguage;
  }
}

export default LanguageService;
