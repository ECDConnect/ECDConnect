import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { EventRecordModelInput } from '@ecdlink/graphql';

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
}

export default EventRecord;
