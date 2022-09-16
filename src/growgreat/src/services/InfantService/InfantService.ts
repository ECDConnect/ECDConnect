import { InfantDto, Config } from '@ecdlink/core';
import { InfantModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class InfantService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async GetAllInfantsForMother(): Promise<InfantDto[]> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query getAllInfantsForHealthCareWorker($id: String) {
          allInfantsForHealthCareWorker(id: $id) {
            id
            user {
              dateOfBirth
              firstName
              genderId
              id
            }
            weightAtBirth
            lengthAtBirth
          }
        }        
      `,
    });

    if (response.status !== 200) {
      throw new Error('Getting Mothers failed - Server connection error');
    }

    return response.data.data.GetAllMother;
  }

  async addInfant(input: InfantModelInput): Promise<InfantDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation addInfant($input: InfantModelInput) {
          addInfant(input: $input) {
            user {
              dateOfBirth
              firstName
              genderId
              id
            }
            id
            weightAtBirth
            lengthAtBirth
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating mother failed - Server connection error');
    }

    return response.data.data.createInfant;
  }
}

export default InfantService;
