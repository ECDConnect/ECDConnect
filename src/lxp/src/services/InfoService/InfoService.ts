import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { MoreInformation } from '@ecdlink/graphql';

class InfoService {
  async getMoreInformation(
    section: string,
    locale: string
  ): Promise<MoreInformation[]> {
    const apiInstance = api(Config.graphQlApi);
    const response = await apiInstance.post<{
      data: { moreInformation: MoreInformation[] };
      errors?: {};
    }>(``, {
      id: 'GetMoreInformation',
      variables: {
        section,
        locale,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get More Information Failed - Server connection error');
    }

    return response.data.data.moreInformation;
  }
}

export default InfoService;
