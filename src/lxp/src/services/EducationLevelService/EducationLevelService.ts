import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { EducationLevelDto } from '@ecdlink/core';
class EducationLevelService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getEducationLevels(): Promise<EducationLevelDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllEducation($isActive: Boolean = true) {
        GetAllEducation(where: { isActive: { eq: $isActive } }) {
          id
          description      
        }
      }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Education Levels Failed - Server connection error');
    }

    return response.data.data.GetAllEducation;
  }
}

export default EducationLevelService;
