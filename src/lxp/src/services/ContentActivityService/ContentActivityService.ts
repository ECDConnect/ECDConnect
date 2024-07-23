import { ActivityDto, Config } from '@ecdlink/core';
import { api } from '../axios.helper';
class ContentActivityService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getActivities(locale: string): Promise<ActivityDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllActivity($locale: String) {
          GetAllActivity(locale: $locale) {
            id
            name
            type
            subType
            image
            materials
            description
            notes
            availableLanguages {
              id
              description
              locale
            }
            image
            subCategories {
              id
              imageUrl
              name
            }
          }
        }
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Activities Failed - Server connection error');
    }

    return response.data.data.GetAllActivity;
  }
}

export default ContentActivityService;
