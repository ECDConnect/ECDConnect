import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';
import { PointsUserSummary } from '@ecdlink/graphql';

class PointsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPointsSummaryForUser(userId: string): Promise<PointsUserSummary[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { pointsSummaryForUser: PointsUserSummary[] };
      errors?: {};
    }>(``, {
      query: `
        query pointsSummaryForUser($userId: String) {
            pointsSummaryForUser(userId: $userId) {
                pointsTotal
                pointsYTD
                month
                year
                userId
                pointsLibrary {
                    id
                    activity
                    subActivity
                    description
                }
            }
        }`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Point for user Failed - Server connection error');
    }

    return response.data.data.pointsSummaryForUser;
  }
}

export default PointsService;
