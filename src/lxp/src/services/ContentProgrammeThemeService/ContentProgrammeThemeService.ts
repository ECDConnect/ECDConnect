import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ProgrammeThemeDto } from '@ecdlink/core';
class ContentProgrammeThemeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgrammeThemes(locale: string): Promise<ProgrammeThemeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllTheme($locale: String) {
          GetAllTheme(locale: $locale) {          
            id
            name
            color
            imageUrl
            themeLogo
            themeDays {
              id
              day
              largeGroupActivity {
                id
              }
              smallGroupActivity {
                id
              }
              storyActivity {
                id
              }
              storyBook {
                id
              }
            }            
          }
        }
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Programme themes Failed - Server connection error');
    }

    return response.data.data.GetAllTheme;
  }
}

export default ContentProgrammeThemeService;
