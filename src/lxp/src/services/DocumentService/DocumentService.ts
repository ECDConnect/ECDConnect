import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { DocumentDto, FileReturnModel } from '@ecdlink/core';
import { DocumentInput } from '@ecdlink/graphql';
class DocumentService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getdocuments(userId: string): Promise<DocumentDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllDocument',
    });

    if (response.status !== 200) {
      throw new Error('Getting Documents failed - Server connection error');
    }

    return response.data.data.GetAllDocument;
  }

  async updateDocument(id: string, input: DocumentInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateDocument',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating document failed - Server connection error');
    }

    return true;
  }

  async fileUpload(
    file: string,
    fileName: string,
    fileType: string
  ): Promise<FileReturnModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'fileUpload',
      variables: {
        file: file,
        fileName: fileName,
        fileType: fileType,
      },
    });

    if (response.status !== 200) {
      throw new Error('Creating document failed - Server connection error');
    }

    return response.data.data.fileUpload;
  }
}

export default DocumentService;
