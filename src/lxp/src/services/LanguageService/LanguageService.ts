import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { LanguageDto } from '@ecdlink/core';
class LanguageService {
  async getLanguages(): Promise<LanguageDto[]> {
    const apiInstance = api(Config.graphQlApi);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          openLanguage {
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

    return response.data.data.openLanguage;
  }
}

export default LanguageService;
