import { Config, ProgrammeRoutineDto } from '@ecdlink/core';
import { api } from '../axios.helper';
class ContentRoutineService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgrammeRoutines(locale: string): Promise<ProgrammeRoutineDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllProgrammeRoutine',
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Programme routines Failed - Server connection error'
      );
    }

    return response.data.data.GetAllProgrammeRoutine;
  }
}

export default ContentRoutineService;
