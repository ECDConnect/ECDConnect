import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { VisitDataStatus } from '@ecdlink/graphql';

class Referral {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getReferralsForInfant(id: string): Promise<VisitDataStatus[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { referralsForInfant: VisitDataStatus[] };
      errors?: {};
    }>(``, {
      query: `
        query GetReferralsForInfant($id: String) {
          referralsForInfant(id: $id) {
            id
            comment
            color
            type
            section
            isCompleted
            visitData {
              visitName
              visitSection
              question
              visit {
                plannedVisitDate
              }
            }
          }
        }
          `,
      variables: {
        id,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Referrals For Infant Failed - Server connection error'
      );
    }

    return response.data.data.referralsForInfant;
  }
}

export default Referral;
