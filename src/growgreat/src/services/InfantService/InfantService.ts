import { InfantDto, Config, VisitDto } from '@ecdlink/core';
import { InfantModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class InfantService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async GetAllInfantsForMother(
    id: string,
    visitType?: 'all' | 'due'
  ): Promise<InfantDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query getAllInfantsForHealthCareWorker($id: String, $visitType: String) {
          allInfantsForHealthCareWorker(id: $id, visitType: $visitType) {
            id
            nextVisitDate
            gender {
              description
            }
            caregiver {
              firstName
              surname
              relation {
                id
                description
              }
            }
            user {
              dateOfBirth
              firstName
              genderId
              id
            }
            statusInfo {
              icon
              color
              notes
              subject
            }
            weightAtBirth
            lengthAtBirth
          }
        }        
      `,
      variables: {
        id,
        visitType,
      },
    });

    if (response.status !== 200) {
      throw new Error('Getting Mothers failed - Server connection error');
    }
    return response.data.data.allInfantsForHealthCareWorker;
  }

  async addInfant(input: InfantModelInput): Promise<InfantDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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

  async getInfantCountForHealthCareWorkerForMonth(id: string): Promise<number> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query getInfantCountForHealthCareWorkerForMonth($userId: String) {
          infantCountForHealthCareWorkerForMonth(userId: $userId) {
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

    return response.data.data.infantCountForHealthCareWorkerForMonth;
  }

  async GetInfantVisits(id: string): Promise<VisitDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { infantVisits: VisitDto[] };
    }>(``, {
      query: `
        query GetInfantVisits($userId: String) {
          infantVisits(id: $userId) {
            id
            actualVisitDate,
            plannedVisitDate,
            attended,
            risk
            visitType{
              id
              order
              normalizedName
              description
              insertedDate
              isActive
              name
              type
              updatedBy
              updatedDate
            }        
          }
        }
        `,
      variables: {
        userId: id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Getting Mothers visits failed - Server connection error'
      );
    }

    return response.data.data.infantVisits;
  }
}

export default InfantService;
