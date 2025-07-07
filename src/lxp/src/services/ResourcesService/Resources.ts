import { PagedQueryInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
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
  ): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetResources(
    $localeId: UUID!
    $sectionType: String
    $search: String
    $dataFreeSearch: [String]
    $likesSearch: [String]
    $startDate: DateTime
    $endDate: DateTime
    $pagingInput: PagedQueryInput
  ) {
    resources(
      localeId: $localeId
      sectionType: $sectionType
      search: $search
      dataFreeSearch: $dataFreeSearch
      likesSearch: $likesSearch
      startDate: $startDate
      endDate: $endDate
      pagingInput: $pagingInput
    ) {
      id
      resourceType
      title
      shortDescription
      link
      longDescription
      dataFree
      sectionType
      numberLikes
      availableLanguages {
        id
      }
      updatedDate
      insertedDate
      __typename
    }
  }
          `,
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

  async getResourceLikedStatusForUser(contentId: number): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
     query GetResourceLikedStatusForUser($contentId: Int!) {
  resourceLikedStatusForUser(
    contentId: $contentId
  ) {
    contentId
    isActive
  }
}
          `,
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
  ): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
     mutation UpdateResourceLikes($contentId: Int!, $contentTypeId: Int!, $liked: Boolean!) {
  updateResourceLikes(
    contentId: $contentId
    contentTypeId: $contentTypeId
    liked: $liked
  ) {
  }
}
          `,
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

  async allResourceLikesForUser(userId: string): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
     query GetAllResourceLikesForUser($userId: UUID!) {
    allResourceLikesForUser(userId: $userId) {
        isActive
        contentId
    }
}
          `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all resources liked by user Failed - Server connection error'
      );
    }

    return response.data.data.allResourceLikesForUser;
  }

  async resourceByLanguage(
    contentId: number,
    contentTypeId: number,
    localeId: string
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
     query GetResourceByLanguage($contentId: Int!, $contentTypeId: Int!, $localeId: UUID!) {
    resourceByLanguage(contentId: $contentId, contentTypeId: $contentTypeId, localeId: $localeId) {
        resourceType
        title
        shortDescription
        link
        longDescription
        dataFree
        sectionType
        numberLikes
        availableLanguages
        
    }
}
          `,
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
