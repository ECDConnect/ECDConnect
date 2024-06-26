import { Config } from '@ecdlink/core';
import { ClassroomInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { ClassroomDto } from '@/models/classroom/classroom.dto';

class ClassroomService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassroomForUser(userId: string): Promise<ClassroomDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { classroomForUser: ClassroomDto };
      errors?: {};
    }>(``, {
      query: `query GetClassroomForUser($userId: UUID!) {
          classroomForUser(userId: $userId) {            
            id
            name
            imageUrl
            numberOfPractitioners
            numberOfAssistants
            numberOfOtherAssistants
            preschoolFeeAmount
            preschoolFeeAmountLastUpdateDate
            preschoolCode
            siteAddress {
              id
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
            }
            principal {
              userId
              firstName
              surname
              phoneNumber
              email
              profileImageUrl
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('GetClassroomForUser Failed - Server connection error');
    }

    return response.data.data.classroomForUser;
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

  async updateClassroomSiteAddress(
    id: string,
    input: ClassroomInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateClassroomSiteAddress($id: UUID!,$input: ClassroomInput) {
          updateClassroomSiteAddress(id: $id, input: $input) {
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
        'Updating classroom site address failed - Server connection error'
      );
    }

    return response.data.data.updateClassroomSiteAddress;
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
          numberPractitioners
          isPrinciple
          siteAddress {
            id
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

  async updatePreschoolFee(
    classroomId: string,
    amount: number | undefined
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updatePreschoolFeeForClassroom($classroomId: UUID!, $amount: Float) {
          updatePreschoolFeeForClassroom(classroomId: $classroomId, amount: $amount) {
          }
        }
      `,
      variables: {
        classroomId: classroomId,
        amount: amount,
      },
    });

    if (response.status !== 200 || !!response.data.error) {
      throw new Error(
        'Updating preschool fee failed - Server connection error'
      );
    }

    return response.data.data.updatePreschoolFeeForClassroom;
  }

  async getClassroomForPreschoolCode(
    preSchoolCode: string
  ): Promise<ClassroomDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { validatePreSchoolCode: ClassroomDto };
      errors?: {};
    }>(``, {
      query: `query ValidatePreSchoolCode($preSchoolCode: String!) {
                validatePreSchoolCode(preSchoolCode: $preSchoolCode) {
                              id
            name
            userId
            numberOfAssistants
            numberOfOtherAssistants
            preschoolFeeAmount
            preschoolFeeAmountLastUpdateDate
            siteAddress {
              id
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
            }
            user {
  principalObjectData {
     principalHierarchy
}
}
                }
              }
      `,
      variables: {
        preSchoolCode,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Validate preschool code Failed - Server connection error'
      );
    }

    return response.data.data.validatePreSchoolCode;
  }

  async getClassroomForTrialPeriodUser(userId: string): Promise<ClassroomDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { trialPeriodClassroomForUser: ClassroomDto };
      errors?: {};
    }>(``, {
      query: `query GetTrialPeriodClassroomForUser($userId: UUID!) {
          trialPeriodClassroomForUser(userId: $userId) {            
            id
            name
            imageUrl
            numberOfPractitioners
            numberOfAssistants
            numberOfOtherAssistants
            preschoolFeeAmount
            preschoolFeeAmountLastUpdateDate
            preschoolCode
            siteAddress {
              id
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
            }
            principal {
              userId
              firstName
              surname
              phoneNumber
              email
              profileImageUrl
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('GetClassroomForUser Failed - Server connection error');
    }

    return response.data.data.trialPeriodClassroomForUser;
  }
}

export default ClassroomService;
