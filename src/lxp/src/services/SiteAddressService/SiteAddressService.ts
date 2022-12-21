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

  async getFranchisorSiteAddressById(
    franchisorId: string
  ): Promise<SiteAddressDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetFranchisorSiteAddressById($franchisorId: String) {
        franchisorSiteAddressById(franchisorId: $franchisorId){
            name
            addressLine1
            addressLine2
            addressLine3
            postalCode
            province {
                description
            }
        }
    }
      `,
      variables: {
        franchisorId: franchisorId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Failed - Server connection error');
    }

    return response.data.data.franchisorSiteAddressById;
  }
}

export default SiteAddressService;
