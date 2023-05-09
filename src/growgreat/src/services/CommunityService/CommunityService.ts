import {
  CommunitySectionGg,
  CommunitySectionItemGg,
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

  async GetAllCommunitySectionGG(
    locale: string
  ): Promise<CommunitySectionGg[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllCommunitySectionGG: CommunitySectionGg[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllCommunitySectionGG($locale: String) {
        GetAllCommunitySectionGG(locale: $locale){
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
        'Get All Community SectionGG Failed - Server connection error'
      );
    }
    return response.data.data.GetAllCommunitySectionGG;
  }

  async GetAllCommunitySectionItemGG(
    locale: string
  ): Promise<CommunitySectionItemGg[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllCommunitySectionItemGG: CommunitySectionItemGg[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllCommunitySectionItemGG($locale: String) {
        GetAllCommunitySectionItemGG(locale: $locale){
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
        'Get All Community Section Item GG Failed - Server connection error'
      );
    }
    return response.data.data.GetAllCommunitySectionItemGG;
  }
}

export default CommunityService;
