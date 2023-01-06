import { MotherDto, Config } from '@ecdlink/core';
import { MotherModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class MotherService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getMothers(id: string): Promise<MotherDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllMothersForHealthCareWorker($id: String) {
          allMothersForHealthCareWorker(id: $id) {
            user {
              id
              firstName
              surname
              phoneNumber
            }
            expectedDateOfDelivery
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
          }
        }   
        `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Getting Mothers failed - Server connection error');
    }

    return response.data.data.allMothersForHealthCareWorker;
  }

  async updateMother(id: string, input: MotherModelInput): Promise<MotherDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateMother($input: MotherModelInput, $id: String) {
          updateMother(input: $input, id: $id) {
            id
            firstName
            surname
            phoneNumber
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
          }
        }
      `,
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating mother failed - Server connection error');
    }

    return response.data.data.updateMother;
  }

  async addMother(input: MotherModelInput): Promise<MotherDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation addMother($input: MotherModelInput) {
          addMother(input: $input) {
            user {
              firstName
              surname
              dateOfBirth
              id 
              phoneNumber
            }
            expectedDateOfDelivery
            siteAddressId
            age
              healthCareWorkerId
            healthCareWorker {
              id
              user {
                userName
                surname
              }
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

    return response.data.data.createMother;
  }

  async getMotherCountForHealthCareWorkerForMonth(id: string): Promise<number> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetMotherCountForHealthCareWorkerForMonth($id: String) {
          motherCountForHealthCareWorkerForMonth(id: $id) {
        
          }
        }   
      `,
      variables: {
        userId: id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Getting count for health care worker for month failed - Server connection error'
      );
    }

    return response.data.data.motherCountForHealthCareWorkerForMonth;
  }
}

export default MotherService;
