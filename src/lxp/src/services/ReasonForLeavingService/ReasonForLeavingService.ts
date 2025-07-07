import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { ReasonForLeavingDto } from '@ecdlink/core';
class ReasonForLeavingService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getReasonsForLeaving(): Promise<ReasonForLeavingDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllReasonForLeaving($isActive: Boolean = true){
        GetAllReasonForLeaving(where: { isActive: { eq: $isActive } }) {
          id
          description      
        }
      }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Reasons for leaving Failed - Server connection error'
      );
    }

    return response.data.data.GetAllReasonForLeaving;
  }
}

export default ReasonForLeavingService;
