import { Config, NoteTypeDto } from '@ecdlink/core';
import { api } from '../axios.helper';
class NoteTypeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getNoteTypes(): Promise<NoteTypeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllNoteType($isActive: Boolean = true){
          GetAllNoteType(where: { isActive: { eq: $isActive } }) {
            id
            description
            enumId
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Grants Failed - Server connection error');
    }
    return response.data.data.GetAllNoteType;
  }
}

export default NoteTypeService;
