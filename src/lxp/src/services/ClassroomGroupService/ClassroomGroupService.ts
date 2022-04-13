import { ClassroomGroupDto, Config } from '@ecdlink/core';
import { ClassroomGroupInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class ClassroomGroupService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassroomGroupById(id: string): Promise<any> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetClassroomGroupById($id:UUID) {
          GetClassroomGroupById(id: $id) {
            id
            learners {
              isActive
                stoppedAttendance
                id
                userId
            }
          }
        }
      `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Classroom Group by id failed - Server connection error'
      );
    }

    return response.data.data.GetClassroomGroupById;
  }

  async getClassroomGroups(): Promise<ClassroomGroupDto[]> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          GetAllClassroomGroup {
            id
            classroomId
            name
            programmeTypeId
            programmeType {
              id
              description
            }            
            isActive                 
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Classroom Groups Failed - Server connection error');
    }

    return response.data.data.GetAllClassroomGroup;
  }

  async updateClassroomGroup(
    id: string,
    input: ClassroomGroupInput
  ): Promise<boolean> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateClassroomGroup($id: UUID!,$input: ClassroomGroupInput) {
          updateClassroomGroup(id: $id, input: $input) {
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
      throw new Error(
        'Updating classroom group failed - Server connection error'
      );
    }

    return true;
  }
}

export default ClassroomGroupService;
