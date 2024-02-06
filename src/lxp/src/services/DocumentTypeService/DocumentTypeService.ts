import { Config, DocumentTypeDto } from '@ecdlink/core';
import { api } from '../axios.helper';
class DocumentTypeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getDocumentTypes(): Promise<DocumentTypeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllDocumentType($isActive: Boolean = true){
          GetAllDocumentType(where: { isActive: { eq: $isActive } }) {
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
    return response.data.data.GetAllDocumentType;
  }
}

export default DocumentTypeService;
