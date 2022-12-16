import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ProgrammeDto } from '@ecdlink/core';
import { DailyProgrammeInput, ProgrammeInput } from '@ecdlink/graphql';
class ProgrammeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgrammes(userId: string): Promise<ProgrammeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllProgramme($createdUserId: String) {
        GetAllProgramme (where: {
          and: [{ 
            createdUserId: {eq: $createdUserId}
          }]
        }) {
          id
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
        createdUserId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Programmes Failed - Server connection error');
    }

    return response.data.data.GetAllProgramme;
  }

  async updateProgramme(id: string, input: ProgrammeInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateProgramme($input: ProgrammeInput, $id: UUID) {
          updateProgramme(input: $input, id: $id) {
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
          updateDailyProgramme(input: $input, id: $id) {
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
}

export default ProgrammeService;
