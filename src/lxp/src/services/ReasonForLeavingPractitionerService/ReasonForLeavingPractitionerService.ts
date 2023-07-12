import { api } from '../axios.helper';
import { Config, ReasonForLeavingPractitionerDto } from '@ecdlink/core';
class ReasonForLeavingPractitionerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getReasonsForLeavingPractitioner(): Promise<
    ReasonForLeavingPractitionerDto[]
  > {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          GetAllReasonForLeavingPractitioner {
            id
            description      
          }
        }
          `,
    });
    console.log(response.data.data);
    if (response.status !== 200) {
      throw new Error(
        'Get Reasons for leaving practitioner Failed - Server connection error'
      );
    }

    return response.data.data.GetAllReasonForLeavingPractitioner;
  }
}

export default ReasonForLeavingPractitionerService;
