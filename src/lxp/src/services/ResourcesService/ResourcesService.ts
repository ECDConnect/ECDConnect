import { PagedQueryInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { Config, ResourceDto, ResourcesLikedDto } from '@ecdlink/core';
class ResourcesService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getResources(
    localeId: string,
    sectionType?: string,
    search?: string,
    dataFreeSearch?: [],
    likesSearch?: [],
    startDate?: string | null,
    endDate?: string | null,
    pagingInput?: PagedQueryInput
  ): Promise<ResourceDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetResources',
      variables: {
        localeId,
        sectionType,
        search,
        dataFreeSearch,
        likesSearch,
        startDate,
        endDate,
        pagingInput,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Resources Failed - Server connection error');
    }

    return response.data.data.resources;
  }

  async getResourceLikedStatusForUser(contentId: number): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetResourceLikedStatusForUser',
      variables: {
        contentId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Resource liked status for user Failed - Server connection error'
      );
    }

    return response.data.data.resourceLikedStatusForUser;
  }

  async updateResourceLikes(
    contentId: number,
    contentTypeId: number,
    liked: boolean
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdateResourceLikes',
      variables: {
        contentId,
        contentTypeId,
        liked,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update liked status for user Failed - Server connection error'
      );
    }

    return response.data.data.updateResourceLikes;
  }

  async allResourceLikesForUser(): Promise<ResourcesLikedDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllResourceLikesForUser',
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all resources liked by user Failed - Server connection error'
      );
    }

    return response.data.data.allResourceLikesForUser;
  }

  async reportResourceProblem(input: {
    contentId: number;
    problemType: string;
    additionalDetails?: string;
    dataFreeAtReport: string;
    linkAtReport: string;
  }): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'ReportResourceProblem',
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Report resource problem Failed - Server connection error'
      );
    }

    return response.data.data.reportResourceProblem;
  }

  async resourceByLanguage(
    contentId: number,
    contentTypeId: number,
    localeId: string
  ): Promise<ResourceDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetResourceByLanguage',
      variables: {
        contentId,
        contentTypeId,
        localeId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Resource by locale Failed - Server connection error'
      );
    }

    return response.data.data.resourceByLanguage;
  }
}

export default ResourcesService;
