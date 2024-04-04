import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';
import {
  PointsLibrary,
  PointsUserSummary,
  UserClubStandingModel,
} from '@ecdlink/graphql';

class PointsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPointsSummaryForUser(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PointsUserSummary[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { pointsSummaryForUser: PointsUserSummary[] };
      errors?: {};
    }>(``, {
      query: `
        query pointsSummaryForUser($userId: String, $startDate: DateTime!, $endDate: DateTime!) {
          pointsSummaryForUser(userId: $userId, startDate: $startDate, endDate: $endDate) {
            pointsTotal
            pointsYTD
            timesScored
            month
            year
            userId
            pointsLibrary {
              id
              activity
              subActivity
              description
              todoDescription
            }
          }
      }`,
      variables: {
        userId,
        startDate,
        endDate,
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
              todoDescription
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

  async getUserClubStanding(userId: string): Promise<UserClubStandingModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { userClubStanding: UserClubStandingModel };
      errors?: {};
    }>(``, {
      query: `query userClubStanding($userId: String) {
          userClubStanding(userId: $userId) {
            percentageMembersWithFewerPointsForCurrentMonth
            percentageMembersWithFewerPointsForCurrentYear
            percentageMembersWithMorePointsForCurrentMonth
            percentageMembersWithMorePointsForCurrentYear
          }
        }`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get standing for user Failed - Server connection error');
    }

    return response.data.data.userClubStanding;
  }

  async addChildRegistrationPoints(userId: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addChildRegistrationPoints: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation addChildRegistrationPoints($userId: String) {
          addChildRegistrationPoints(userId: $userId){
          }
        }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Adding child registration points failed - Server connection error'
      );
    }

    return true;
  }
}

export default PointsService;
