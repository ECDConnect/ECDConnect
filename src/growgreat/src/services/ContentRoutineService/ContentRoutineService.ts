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
      query: `
      query GetAllProgrammeRoutine($locale: String) {
        GetAllProgrammeRoutine(locale: $locale) {          
          id
          description
          name
          headerBanner            
          routineItems {
            id
            sequence
            name
            description
            image
            imageBackgroundColor
            icon
            iconBackgroundColor
            alert
            timeSpan
            routineSubItems {
              id                
              name
              description
              image
              imageBackgroundColor
              timeSpan
            }              
          }            
        }
      }`,
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
