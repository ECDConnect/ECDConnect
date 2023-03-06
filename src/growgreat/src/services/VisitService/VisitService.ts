import { api } from '../axios.helper';
import { Config, VisitStatusDto } from '@ecdlink/core';
import { CmsVisitDataInputModelInput } from '@ecdlink/graphql';

class Visit {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getHealthCareWorkerVisitStatus(
    userId: string
  ): Promise<VisitStatusDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { healthCareWorkerVisitStatus: VisitStatusDto };
      errors?: {};
    }>(``, {
      query: `
        query GetHealthCareWorkerVisitStatus($userId: String) {
          healthCareWorkerVisitStatus(userId: $userId) {
            motherOverDueVisits
            motherDueVisits
            childDueVisits
          }
        } 
          `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Health Care Worker Visit Status Failed - Server connection error'
      );
    }

    return response.data.data.healthCareWorkerVisitStatus;
  }

  // TODO: add interface
  async addVisitFormData(input: CmsVisitDataInputModelInput): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
          mutation AddVisitData($input: CMSVisitDataInputModelInput) {
            addVisitData(input: $input) {
            }
        }
        `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Adding visit data failed - Server connection error');
    }

    return response.data.data.createInfant;
  }
}

export default Visit;
