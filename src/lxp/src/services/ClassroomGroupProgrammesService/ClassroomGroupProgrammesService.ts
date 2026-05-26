import { Config } from '@ecdlink/core';
import { ClassProgrammeInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class ClassroomGroupProgrammesService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async updateClassProgramme(
    id: string,
    input: ClassProgrammeInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateClassProgramme',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating classroom group programme failed - Server connection error'
      );
    }

    return true;
  }
}

export default ClassroomGroupProgrammesService;
