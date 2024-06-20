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
      query: `
      query GetAllProgramme($classroomId: UUID) {
        GetAllProgramme(where: { and: [{ classroomId: { eq: $classroomId } }] }) {
          id
          insertedDate
          classroomId
          startDate
          endDate
          name
          preferredLanguage
          dailyProgrammes {
            id
            day
            dayDate
            smallGroupActivityId
            largeGroupActivityId
            storyActivityId
            storyBookId
          }
        }
      }
      `,
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
      query: `
        mutation updateProgrammes($programmeInput: ProgrammeModelInput) {
          updateProgrammes(programmeInput: $programmeInput) {
          }
        }
      `,
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
      query: `
        mutation updateProgramme($input: ProgrammeInput, $id: UUID) {
          updateProgramme(id: $id, input: $input) {
            id
          }
        }
      `,
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
      query: `
        mutation updateDailyProgramme($input: DailyProgrammeInput, $id: UUID) {
          updateDailyProgramme(id: $id, input: $input) {
            id
          } 
        }
      `,
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
      query: `
      query GetUserProgrammes {
        userProgrammes {
          id
          insertedDate
          classroomId
          classroomGroupId
          startDate
          endDate
          name
          preferredLanguage
          dailyProgrammes {
            insertedDate
            isActive
            id
            day
            dayDate
            smallGroupActivityId
            largeGroupActivityId
            storyActivityId
            storyBookId
          }
        }
      }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Get Programmes Failed - Server connection error');
    }

    return response.data.data.userProgrammes;
  }
}

export default ProgrammeService;
