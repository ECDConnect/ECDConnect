import {
  UpdateUserPermissionInputModelInput,
  UserPermissionModel,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { Config, ProfileSkillsDto } from '@ecdlink/core';
class SkillsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getCommunitySkills(): Promise<ProfileSkillsDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetCommunitySkills() {
    communitySkills() {
        id
        name
        description
        imageName
        ordering
    }
}  `,
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get community skills Failed - Server connection error');
    }
    return response.data.data.communitySkills;
  }
}

export default SkillsService;
