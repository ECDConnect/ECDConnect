import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';
import {
  PointsToDoItemModel,
  PointsUserSummary,
  PointsUserYearMonthSummary,
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
            dateScored
            pointsActivity {
              id
              name
              points
              maxPointsIndividualMonthly
              maxPointsIndividualYearly
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

  async pointsTodoItems(userId: string): Promise<PointsToDoItemModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { pointsTodoItems: PointsToDoItemModel };
      errors?: {};
    }>(``, {
      query: `query GetPointsTodoItems($userId: UUID!) {    
    pointsTodoItems(userId: $userId) {        
        signedUpForApp        
        isPartOfPreschool        
        savedIncomeOrExpense        
        plannedOneDay        
        viewedCommunitySection    
    }
}`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get points to do Failed - Server connection error');
    }

    return response.data.data.pointsTodoItems;
  }

  async sharedData(userId: string, isMonthly: boolean): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { sharedData: any };
      errors?: {};
    }>(``, {
      query: `query GetSharedData($userId: UUID!, $isMonthly: Boolean!) {
    sharedData(userId: $userId, isMonthly: $isMonthly) {
        total
        totalChildren
        activityDetail {
            activity
            timesScored
            pointsTotal
        }
        userRankingData {
            pointsTotal
            comparativeTargetPercentage
            comparativeTargetPercentageColor
            comparativePrimaryMessage
            comparativeSecondaryMessage
            nonComparativeTargetPercentage
            nonComparativeTargetPercentageColor
            nonComparativePrimaryMessage
            nonComparativeSecondaryMessage
            messageNr
        }
    }
}`,
      variables: {
        userId,
        isMonthly,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Share data for user Failed - Server connection error');
    }

    return response.data.data.sharedData;
  }

  async yearPointsView(userId: string): Promise<PointsUserYearMonthSummary> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { yearPointsView: PointsUserYearMonthSummary };
      errors?: {};
    }>(``, {
      query: `query GetYearPointsView($userId: UUID!) {
    yearPointsView(userId: $userId) {
        total
        monthSummary {
            month
            total
            activityDetail {
                activity
                timesScored
                pointsTotal
            }
        }
        
    }
}`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get year points view Failed - Server connection error');
    }

    return response.data.data.yearPointsView;
  }
}

export default PointsService;
