import { ChildProgressReportsStatus, CoachInput } from '@ecdlink/graphql';
import { CoachDto } from '@ecdlink/core';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';

class CoachService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getCoachByUserId(userId: string): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'coachByUserId',
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Failed - Server connection error');
    }

    return response.data.data.coachByUserId;
  }

  async getCoachByCoachId(userId: string): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'coachByCoachUserId',
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Failed - Server connection error');
    }

    return response.data.data.coachByCoachUserId;
  }

  async coachNameByUserId(userId: string): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'coachNameByUserId',
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Name Failed - Server connection error');
    }

    return response.data.data.coachNameByUserId;
  }

  async updateCoach(coachId: string, coach: CoachInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateCoach',
      variables: {
        id: coachId,
        input: coach,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating Coach failed - Server connection error');
    }

    return true;
  }

  async saveCoachContact(
    practitionerId: string,
    actionItemType: number,
    period: Date
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'saveCoachContact',
      variables: {
        practitionerId: practitionerId,
        actionItemType: actionItemType,
        period: period,
      },
    });

    if (response.status !== 200) {
      throw new Error('Saving Coach Contact failed - Server connection error');
    }

    return true;
  }

  async getChildProgressReportsStatusForUser(
    userId: string
  ): Promise<ChildProgressReportsStatus> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { childProgressReportsStatus: ChildProgressReportsStatus };
      errors?: {};
    }>(``, {
      id: 'childProgressReportsStatus',
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Get child progress reports failed - Server connection error'
      );
    }

    return response.data.data.childProgressReportsStatus;
  }

  async getClassroomGroupsForCoach(
    userId: string
  ): Promise<SimpleClassroomGroupDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allClassroomGroupsForCoach: SimpleClassroomGroupDto[] };
      errors?: {};
    }>(``, {
      id: 'GetAllClassroomGroupsForCoach',
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'GetClassroomGroupsForCoach Failed - Server connection error'
      );
    }

    return response.data.data.allClassroomGroupsForCoach;
  }
}

export default CoachService;
