import { Config, SiteAddressDto } from '@ecdlink/core';
import { SiteAddressInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class SiteAddressService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async updateSiteAddress(
    id: string,
    input: SiteAddressInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateSiteAddress($id: UUID!,$input: SiteAddressInput) {
          updateSiteAddress(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating site address failed - Server connection error');
    }

    return true;
  }
}

export default SiteAddressService;
