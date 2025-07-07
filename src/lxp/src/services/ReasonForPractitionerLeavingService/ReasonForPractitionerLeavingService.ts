import { api } from '../axios.helper';
import { Config, ReasonForPractitionerLeavingDto } from '@ecdlink/core';
class ReasonForPractitionerLeavingService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getReasonsForPractitionerLeaving(): Promise<
    ReasonForPractitionerLeavingDto[]
  > {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllReasonForPractitionerLeaving($isActive: Boolean = true) {
          GetAllReasonForPractitionerLeaving(where: { isActive: { eq: $isActive } }) {
            id
            description      
          }
        }
          `,
    });
    if (response.status !== 200) {
      throw new Error(
        'Get Reasons for practitioner leaving Failed - Server connection error'
      );
    }

    return response.data.data.GetAllReasonForPractitionerLeaving;
  }
}

export default ReasonForPractitionerLeavingService;
