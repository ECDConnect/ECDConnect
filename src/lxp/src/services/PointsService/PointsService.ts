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
      id: 'pointsSummaryForUser',
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
      id: 'addChildRegistrationPoints',
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
      id: 'GetPointsTodoItems',
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
      id: 'GetSharedData',
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
      id: 'GetYearPointsView',
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
