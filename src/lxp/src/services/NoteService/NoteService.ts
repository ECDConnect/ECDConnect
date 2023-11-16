import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { NoteDto } from '@ecdlink/core';
import { NoteInput } from '@ecdlink/graphql';
class NoteService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getNotes(userId: string): Promise<NoteDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllNote($createdUserId: UUID) {
          GetAllNote (where: {
            and: [{ 
              createdUserId: {eq: $createdUserId}
            }]
          }) {
            id
            name
            bodyText
            noteTypeId
            userId            
            insertedDate
            isActive
          }
        } 
      `,
      variables: {
        createdUserId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Getting Ntoes failed - Server connection error');
    }

    return response.data.data.GetAllNote;
  }

  async updateNote(id: string, input: NoteInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateNote($input: NoteInput, $id: UUID) {
          updateNote(input: $input, id: $id) {
            id
          }
        }
      `,
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating note failed - Server connection error');
    }

    return true;
  }

  async deleteNote(id: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation deleteNote($id: UUID!) {
          deleteNote(id: $id)
        }
      `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Deleting note failed - Server connection error');
    }

    return true;
  }
}

export default NoteService;
