import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ProgrammeTypeDto } from '@ecdlink/core';
class ProgrammeTypeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgrammeTypes(): Promise<ProgrammeTypeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          GetAllProgrammeType {
            id
            description
            enumId
          }
        }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Get Programme Types Failed - Server connection error');
    }

    return response.data.data.GetAllProgrammeType;
  }
}

export default ProgrammeTypeService;
