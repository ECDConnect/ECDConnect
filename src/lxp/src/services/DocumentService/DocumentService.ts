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
      query: `
        query GetAllDocument {
          GetAllDocument {
            id
            isActive
            user {
              firstName
              surname
            }
            userId
            reference
            name
            workflowStatusId            
            documentTypeId
            documentType {
              id
              name
              description
            }
          }
        }        
      `,
      variables: {
        createdUserId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Getting Documents failed - Server connection error');
    }

    return response.data.data.GetAllDocument;
  }

  async updateDocument(id: string, input: DocumentInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateDocument($id: UUID!,$input: DocumentInput) {
          updateDocument(id: $id, input: $input) {
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
      query: `
        mutation fileUpload($file: String, $fileName: String, $fileType: FileTypeEnum!) {
          fileUpload(file: $file, fileName: $fileName, fileType: $fileType) {
            name
            reference
            url
          }
        }
      `,
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
