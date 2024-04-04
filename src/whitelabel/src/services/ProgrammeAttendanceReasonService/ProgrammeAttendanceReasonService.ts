import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ProgrammeAttendanceReasonDto } from '@ecdlink/core';
class ProgrammeAttendanceReasonService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgrammeAttendanceReasons(): Promise<
    ProgrammeAttendanceReasonDto[]
  > {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllProgrammeAttendanceReason($isActive: Boolean = true){
        GetAllProgrammeAttendanceReason(where: { isActive: { eq: $isActive } }) {
          id
          reason      
        }
      }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Programme Attendance Reasons Failed - Server connection error'
      );
    }

    return response.data.data.GetAllProgrammeAttendanceReason;
  }
}

export default ProgrammeAttendanceReasonService;
