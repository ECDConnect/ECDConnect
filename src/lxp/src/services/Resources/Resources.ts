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
    dataFreeSearch?: [string],
    likesSearch?: [string],
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

    return response.data.data.GetResources;
  }
}

export default ResourcesService;
