import { ClassroomDto, Config } from '@ecdlink/core';
import { ClassroomInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class ClassroomService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassrooms(): Promise<ClassroomDto[]> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          GetAllClassroom {
            id
            name
            classroomImageUrl
            isActive
            userId
            isPrinciple
            numberPractitioners
            numberOfOtherAssistants
            insertedDate
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Classrooms Failed - Server connection error');
    }

    return response.data.data.GetAllClassroom;
  }

  async updateClassroom(id: string, input: ClassroomInput): Promise<boolean> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateClassroom($id: UUID!,$input: ClassroomInput) {
          updateClassroom(id: $id, input: $input) {
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
      throw new Error('Updating classroom failed - Server connection error');
    }

    return true;
  }
}

export default ClassroomService;
