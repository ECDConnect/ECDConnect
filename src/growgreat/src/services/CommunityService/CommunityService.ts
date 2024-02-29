import {
  Connect,
  ConnectItem,
  MutationSaveWelcomeMessageArgs,
} from '@ecdlink/graphql/lib';
import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';

class CommunityService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getAllConnect(locale: string): Promise<Connect[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllConnect: Connect[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllConnect($locale: String) {
        GetAllConnect(locale: $locale){
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
      throw new Error('Get All Connect Failed - Server connection error');
    }
    return response.data.data.GetAllConnect;
  }

  async getAllConnectItem(locale: string): Promise<ConnectItem[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllConnectItem: ConnectItem[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllConnectItem($locale: String) {
        GetAllConnectItem(locale: $locale){
          buttonText
          link
          linkedConnect {
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
      throw new Error('Get All Connect Item Failed - Server connection error');
    }
    return response.data.data.GetAllConnectItem;
  }

  async saveWelcomeMessage(
    input: MutationSaveWelcomeMessageArgs
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { saveWelcomeMessage: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation SaveWelcomeMessage($clubId: UUID!, $practitionerId: UUID!, $welcomeMessage: String, $shareContactInfo: Boolean!) {
          saveWelcomeMessage(clubId: $clubId, practitionerId: $practitionerId, welcomeMessage: $welcomeMessage, shareContactInfo: $shareContactInfo) {
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Save welcome message failed - Server connection error');
    }

    return response.data.data.saveWelcomeMessage;
  }
}

export default CommunityService;
