import { MotherDto, Config, VisitDto } from '@ecdlink/core';
import {
  EventRecordType,
  MotherModelInput,
  Scalars,
  Visit,
  VisitModelInput,
} from '@ecdlink/graphql';
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
            clickedVisitTab
            clickedProgressTab
            clickedReferralsTab
            clickedContactTab
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
            whatsAppNumber
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

  async updateMotherDeliveryDate(
    id: string,
    expectedDateOfDelivery: Scalars['DateTime']
  ): Promise<MotherDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateMotherDeliveryDate: MotherDto };
      errors?: {};
    }>(``, {
      query: `
        mutation UpdateMotherDeliveryDate($id: String, $expectedDateOfDelivery: DateTime) {
          updateMotherDeliveryDate(id: $id, expectedDateOfDelivery: $expectedDateOfDelivery) {
              id
              expectedDateOfDelivery
          }
        }
      `,
      variables: {
        id: id,
        expectedDateOfDelivery,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating mother delivered date failed - Server connection error'
      );
    }

    return response.data.data.updateMotherDeliveryDate;
  }

  async updateMother(id: string, input: MotherModelInput): Promise<MotherDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateMother($input: MotherModelInput, $id: String) {
          updateMother(input: $input, id: $id) {
            clickedVisitTab
            clickedProgressTab
            clickedReferralsTab
            clickedContactTab
            user {
              id
              firstName
              surname
              phoneNumber
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

  async addAdditionalVisitForMother(input: VisitModelInput): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addAdditionalVisitForMother: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation addAdditionalVisitForMother($input: VisitModelInput) {
          addAdditionalVisitForMother(input: $input) {
            insertedDate
            actualVisitDate,
            plannedVisitDate,
            orderDate
            attended,
            id,
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
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'add Additional Visit For Mother failed - Server connection error'
      );
    }

    return response.data.data.addAdditionalVisitForMother;
  }

  async getMotherVisits(id: string): Promise<VisitDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { motherVisits: VisitDto[] };
    }>(``, {
      query: `
        query GetMotherVisits($userId: String) {
          motherVisits(id: $userId) {
              insertedDate
              actualVisitDate
              plannedVisitDate
              orderDate
              dueDate
              attended
              visitInProgress
              id
              risk
              comment
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

  async updateMotherAddress(
    id: string,
    input: MotherModelInput
  ): Promise<MotherDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateMotherAddress($input: MotherModelInput, $id: String) {
          updateMotherAddress(input: $input, id: $id) {
            id
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
      throw new Error(
        'Updating mother address failed - Server connection error'
      );
    }

    return response.data.data.updateMotherAddress;
  }

  async updateMotherContactDetails(
    id: string,
    input: MotherModelInput
  ): Promise<MotherDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateMotherContactDetails($input: MotherModelInput, $id: String) {
          updateMotherContactDetails(input: $input, id: $id) {
            id
            whatsAppNumber
            user {
              phoneNumber
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
      throw new Error(
        'Updating mother contact details failed - Server connection error'
      );
    }

    return response.data.data.updateMotherContactDetails;
  }
}

export default MotherService;
