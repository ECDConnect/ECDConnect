import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ProgrammeDto } from '@ecdlink/core';
import {
  DailyProgrammeInput,
  ProgrammeInput,
  ProgrammeModelInput,
} from '@ecdlink/graphql';
class ProgrammeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgrammes(classroomId: string): Promise<ProgrammeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllProgramme',
      variables: {
        classroomId: classroomId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Programmes Failed - Server connection error');
    }

    return response.data.data.GetAllProgramme;
  }

  async updateProgrammes(
    programmeInput: ProgrammeModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateProgrammes',
      variables: {
        programmeInput: programmeInput,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating programmes failed - Server connection error');
    }

    return true;
  }

  async updateProgramme(id: string, input: ProgrammeInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateProgramme',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating programme failed - Server connection error');
    }

    return true;
  }

  async updateDailyProgramme(
    id: string,
    input: DailyProgrammeInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateDailyProgramme',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating daily programme failed - Server connection error'
      );
    }

    return true;
  }

  async getUserProgrammes(): Promise<ProgrammeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetUserProgrammes',
    });

    if (response.status !== 200) {
      throw new Error('Get Programmes Failed - Server connection error');
    }

    return response.data.data.userProgrammes;
  }
}

export default ProgrammeService;
