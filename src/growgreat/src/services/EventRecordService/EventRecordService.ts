import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import {
  EventRecordModelInput,
  EventRecordType,
  EventRecord as IEventRecord,
} from '@ecdlink/graphql';

class EventRecord {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async addEventRecord(input: EventRecordModelInput): Promise<{ id: string }> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { id: string };
      errors?: {};
    }>(``, {
      query: `
        mutation addEventRecord($input: EventRecordModelInput) {
          addEventRecord(input: $input) {
              id
          }
        } 
          `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add Event Record Failed - Server connection error');
    }

    return response.data.data;
  }

  async getAllEventRecordTypes(
    type: 'mother' | 'child'
  ): Promise<EventRecordType[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allEventRecordTypesForType: EventRecordType[] };
      errors?: {};
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
        type,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Getting event record types failed - Server connection error'
      );
    }

    return response.data.data.allEventRecordTypesForType;
  }

  async getEventRecordByClientId(clientId: string): Promise<IEventRecord> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetEventRecordById: IEventRecord };
      errors?: {};
    }>(``, {
      query: `
        query GetEventRecordForClient($clientId: UUID!) {          
          eventRecordForClient(clientId: $clientId) {            
            eventRecordType {
              id
              name
            }            
            id            
            infantId            
            insertedDate            
            isActive            
            linkedVisitId            
            motherId            
            notes            
            updatedBy            
            updatedDate          
          }        
        } 
        `,
      variables: {
        clientId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Getting event record by clientId failed - Server connection error'
      );
    }

    return response.data.data.GetEventRecordById;
  }
}

export default EventRecord;
