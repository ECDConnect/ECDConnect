import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';
import { PointsLibrary, PointsUserSummary } from '@ecdlink/graphql';

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

  async getPointsLibrary(): Promise<PointsLibrary[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { pointsLibrary: PointsLibrary[] };
      errors?: {};
    }>(``, {
      query: `
        query pointsLibrary() {
            pointsLibrary() {
              id
              activity
              subActivity
              description
              points
              maxPointsIndividualMonthly
              maxPointsNonPrincipalMonthly
              maxPointsNonPrincipalYearly
              maxPointsPrincipalMonthly
              maxPointsPrincipalYearly
            }
        }`,
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Points library Failed - Server connection error');
    }

    return response.data.data.pointsLibrary;
  }
}

export default PointsService;
