import { CoachDto } from '@ecdlink/core';
import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';

class CoachService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getCoachById(id: number): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetCoachById($id: Int) {
          GetCoachById(id: $id) {
            id
            user {
              firstName
              surname
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
            }
            siteAddress {
              id
              province {
                id
                description
              }
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
            }            
            startDate
          }
        }
      `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Failed - Server connection error');
    }

    return response.data.data.GetCoachById;
  }
}

export default CoachService;
