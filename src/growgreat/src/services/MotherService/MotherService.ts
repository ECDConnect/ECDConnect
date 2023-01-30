import { MotherDto, Config, VisitDto } from '@ecdlink/core';
import { EventRecordType, MotherModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class MotherService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getMothers(
    id: string,
    visitType?: 'all' | 'overdue' | 'due'
  ): Promise<MotherDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllMothersForHealthCareWorker($id: String, $visitType: String) {
          allMothersForHealthCareWorker(id: $id, visitType: $visitType) {
            statusInfo {
              icon
              color
              notes
              subject
            }
            user {
              id
              firstName
              surname
              phoneNumber
            }
            nextVisitDate
            age
            insertedDate
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
        id,
        visitType,
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
        id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Getting count for health care worker for month failed - Server connection error'
      );
    }

    return response.data.data.motherCountForHealthCareWorkerForMonth;
  }

  async addAdditionalVisitForMother(id: string): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation addAdditionalVisitForMother($input: VisitModel) {
          addAdditionalVisitForMother(input: @input) {
            id
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

    return response.data.data.motherVisits;
  }

  async getMotherVisits(id: string): Promise<VisitDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { motherVisits: VisitDto[] };
    }>(``, {
      query: `
        query GetMotherVisits($userId: String) {
          motherVisits(id: $userId) {
              actualVisitDate,
              plannedVisitDate,
              attended,
              visitType{
                id
                order
                normalizedName
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

    return response.data.data.motherVisits;
  }

  async getAllMotherEventRecordTypes(): Promise<EventRecordType[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allEventRecordTypesForType: EventRecordType[] };
    }>(``, {
      query: `
        query GetAllEventRecordTypesForType($type: String) {
          allEventRecordTypesForType(type: $type) {
            id
            name
            normalizedName
            description
            parentId
            type
            children {
                id
                name
                normalizedName
                description
                type
            }
          }
        }
        `,
      variables: {
        type: 'mother',
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Getting event record types failed - Server connection error'
      );
    }

    return response.data.data.allEventRecordTypesForType;
  }
}

export default MotherService;
