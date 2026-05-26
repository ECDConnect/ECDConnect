import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { StoryBookDto } from '@ecdlink/core';
class ContentStoryBookService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getStoryBooks(locale: string): Promise<StoryBookDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllStoryBook',
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Story books Failed - Server connection error');
    }

    return response.data.data.GetAllStoryBook;
  }
}

export default ContentStoryBookService;
