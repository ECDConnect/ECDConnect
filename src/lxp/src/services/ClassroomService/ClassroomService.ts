import { PrincipalDto } from './../../../../../packages/core/src/models/dto/Users/principal.dto';
import { ClassroomDto, Config, ClassroomGroupDto } from '@ecdlink/core';
import { ClassroomInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class ClassroomService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassrooms(): Promise<ClassroomDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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
            siteAddressId
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
    });

    if (response.status !== 200) {
      throw new Error('Get Classrooms Failed - Server connection error');
    }

    return response.data.data.GetAllClassroom;
  }

  async updateClassroom(id: string, input: ClassroomInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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

  async getAllClassroomForCoach(userId: string): Promise<ClassroomDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query allClassroomsForCoach($userId: String) {
        allClassroomsForCoach(userId: $userId) {
          id
          userId
          name
          classroomImageUrl
          isPrinciple
        }
      }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioners For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allClassroomsForCoach;
  }

  async getClassroomGroupClassroomsForPractitioner(
    userId: string
  ): Promise<ClassroomDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query classroomGroupClassroomsForPractitioner($userId: String) 
      {
                classroomGroupClassroomsForPractitioner(userId: $userId) 
                {          
                  userId
                  id
                  name
                  classroom 
                  { 
                    id
                    name
                    userId
                   } 
                   programmeType
                    { 
                      id
                     } 
                    }   
                     }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Classroom Failed - Server connection error');
    }

    return response.data.data.classroomGroupClassroomsForPractitioner;
  }

  async getClassroomsForPractitioner(
    practitionerId: string,
    principalId: string
  ): Promise<{
    classroom: ClassroomDto;
    principal: PrincipalDto;
    classroomGroups: ClassroomGroupDto[];
  }> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
        query GetClassroomForPractitioner(
          $practitionerId: String
          $principalId: String
        ) {
          classroom: allClassroomsForPractitioner(
            practitionerId: $practitionerId
            principalId: $principalId
          ) {
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
          principal: allClassroomsForPractitioner(
            practitionerId: $practitionerId
            principalId: $principalId
          ) {
            user {
              firstName
              surname
              fullName
            }
          }
          classroomGroups: allClassroomsForPractitioner(
            practitionerId: $practitionerId
            principalId: $principalId
          ) {
            classroomGroups {
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
        }
      `,
      variables: {
        practitionerId,
        principalId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioners For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allClassroomsForPractitioner;
  }
}

export default ClassroomService;
