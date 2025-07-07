import { api } from '../axios.helper';
import {
  Config,
  ReasonForPractitionerLeavingProgrammeDto,
} from '@ecdlink/core';
class ReasonForPractitionerLeavingProgrammeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getReasonsForPractitionerLeavingProgramme(): Promise<
    ReasonForPractitionerLeavingProgrammeDto[]
  > {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllReasonForPractitionerLeavingProgramme($isActive: Boolean = true){
          GetAllReasonForPractitionerLeavingProgramme(where: { isActive: { eq: $isActive } }) {
            id
            description      
          }
        }
          `,
    });
    if (response.status !== 200) {
      throw new Error(
        'Get Reasons for practitioner leaving programme Failed - Server connection error'
      );
    }

    return response.data.data.GetAllReasonForPractitionerLeavingProgramme;
  }
}

export default ReasonForPractitionerLeavingProgrammeService;
