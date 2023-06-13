import {
  CommunitySectionItemSs,
  CommunitySectionSs,
} from '@ecdlink/graphql/lib';
import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';

class CommunityService {
  // _locale: string;
  _accessToken: string;

  constructor(accessToken: string) {
    // this._locale = locale;
    this._accessToken = accessToken;
  }

  async GetAllCommunitySectionSS(
    locale: string
  ): Promise<CommunitySectionSs[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllCommunitySectionSS: CommunitySectionSs[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllCommunitySectionSS($locale: String) {
        GetAllCommunitySectionSS(locale: $locale){
          id
          name
        }
      }
      `,
      variables: {
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get All Community SectionSS Failed - Server connection error'
      );
    }
    return response.data.data.GetAllCommunitySectionSS;
  }

  async GetAllCommunitySectionItemSS(
    locale: string
  ): Promise<CommunitySectionItemSs[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllCommunitySectionItemSS: CommunitySectionItemSs[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllCommunitySectionItemSS($locale: String) {
        GetAllCommunitySectionItemSS(locale: $locale){
          buttonText
          link
          linkedSection {
            name
          }
        }
      }
      `,
      variables: {
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get All Community Section Item SS Failed - Server connection error'
      );
    }
    return response.data.data.GetAllCommunitySectionItemSS;
  }
}

export default CommunityService;
