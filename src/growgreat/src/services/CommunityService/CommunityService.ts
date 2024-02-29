import { Connect, ConnectItem } from '@ecdlink/graphql/lib';
import { api } from '../axios.helper';
import { Config, LeagueWithClinicRankingsDto } from '@ecdlink/core';

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

  async getLeagueById(leagueId: string): Promise<LeagueWithClinicRankingsDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        leagueById: LeagueWithClinicRankingsDto;
      };
      errors?: {};
    }>(``, {
      query: `
      query getLeagueById($leagueId: UUID!) {
        leagueById(leagueId: $leagueId) {
          id
          name
          startDate
          endDate
          leagueTypeId
          leagueTypeName
          clinics {
            clinicId
            clinicName
            leagueRanking
            pointsTotal
          }
        }
      }
      `,
      variables: {
        leagueId: leagueId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('getLeagueById Failed - Server connection error');
    }

    return response.data.data.leagueById;
  }
}

export default CommunityService;
