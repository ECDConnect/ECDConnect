import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';
class ContentService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async hasContentTypeBeenTranslated(
    id: number,
    ageGroup: number,
    localeId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query hasContentTypeBeenTranslated($id: Int!, $ageGroup: Int!, $localeId: UUID!) {
          hasContentTypeBeenTranslated(id: $id, ageGroup: $ageGroup,localeId: $localeId) 
        }
      `,
      variables: {
        id: id,
        ageGroup: ageGroup,
        localeId: localeId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Has Content Type been translated  Failed - Server connection error'
      );
    }

    return response.data.data.hasContentTypeBeenTranslated;
  }
}

export default ContentService;
