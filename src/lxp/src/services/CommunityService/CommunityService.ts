import {
  AcceptRejectCommunityRequestsInputModelInput,
  CoachFeedbackInputModelInput,
  CommunityConnectInputModelInput,
  CommunityProfile,
  CommunityProfileInputModelInput,
  Connect,
  ConnectItem,
  FeedbackTypeSortInput,
  SupportRatingSortInput,
} from '@ecdlink/graphql/lib';
import { api } from '../axios.helper';
import { CommunityProfileDto, Config } from '@ecdlink/core';

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
      id: 'GetAllConnect',
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
      id: 'GetAllConnectItem',
      variables: {
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get All Connect Item Failed - Server connection error');
    }
    return response.data.data.GetAllConnectItem;
  }

  async getCommunityProfile(): Promise<CommunityProfile> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      id: 'GetCommunityProfile',
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get community profile Failed - Server connection error');
    }
    return response.data.data.communityProfile;
  }

  async saveCommunityProfile(
    input: CommunityProfileInputModelInput
  ): Promise<CommunityProfileDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'SaveCommunityProfile',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Saving practitioner community profile failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfile;
  }

  async getUsersToConnectWith(
    provinceIds: string[],
    communitySkillIds: string[],
    connectionTypes: string[]
  ): Promise<CommunityProfileDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      id: 'GetUsersToConnectWith',
      variables: {
        provinceIds,
        communitySkillIds,
        connectionTypes,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get community ECD heroes Failed - Server connection error'
      );
    }
    return response.data.data.usersToConnectWith;
  }

  async getOtherConnections(
    provinceIds: string[],
    communitySkillIds: string[]
  ): Promise<CommunityProfile[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      id: 'GetOtherConnections',
      variables: {
        provinceIds,
        communitySkillIds,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get community ECD heroes Failed - Server connection error'
      );
    }
    return response.data.data.otherConnections;
  }

  async saveCommunityProfileConnections(
    input: CommunityConnectInputModelInput[]
  ): Promise<CommunityConnectInputModelInput[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'SaveCommunityProfileConnections',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating practitioner community connections failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfileConnections;
  }

  async cancelCommunityRequest(
    input: CommunityConnectInputModelInput
  ): Promise<CommunityConnectInputModelInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'CancelCommunityRequest',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating cancel community connection failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfileConnections;
  }

  async saveCoachFeedback(
    input: CoachFeedbackInputModelInput
  ): Promise<CoachFeedbackInputModelInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'SaveCoachFeedback',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Saving coach feedback failed - Server connection error');
    }

    return response.data.data.saveCoachFeedback;
  }

  async getFeedbackTypes(): Promise<FeedbackTypeSortInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      id: 'GetFeedbackTypes',
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get community ECD heroes Failed - Server connection error'
      );
    }
    return response.data.data.feedbackTypes;
  }

  async getSupportRatings(): Promise<SupportRatingSortInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      id: 'GetSupportRatings',
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get support ratings Failed - Server connection error');
    }
    return response.data.data.supportRatings;
  }

  async acceptCommunityRequests(
    input: AcceptRejectCommunityRequestsInputModelInput
  ): Promise<CommunityProfileDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'AcceptRejectCommunityRequests',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Accepting community connections requests failed - Server connection error'
      );
    }

    return response.data.data.acceptRejectCommunityRequests;
  }

  async deleteCommunityProfile(communityProfileId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'DeleteCommunityProfile',
      variables: {
        communityProfileId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Deleting practitioner community profile failed - Server connection error'
      );
    }

    return response.data.data.deleteCommunityProfile;
  }
}

export default CommunityService;
