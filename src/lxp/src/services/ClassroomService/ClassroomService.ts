import { Config } from '@ecdlink/core';
import { ClassroomInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
import {
  ChildProgressReportPeriodDto,
  ClassroomDto,
} from '@/models/classroom/classroom.dto';

class ClassroomService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassroomForUser(userId?: string): Promise<ClassroomDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { classroomForUser: ClassroomDto };
      errors?: {};
    }>(``, {
      id: 'GetClassroomForUser',
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
      id: 'updateClassroom',
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
      id: 'updateClassroomSiteAddress',
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

  async getAllClassroomForCoach(): Promise<ClassroomDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'allClassroomsForCoach',
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioners For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allClassroomsForCoach;
  }

  async getClassroomForPreschoolCode(
    preSchoolCode: string
  ): Promise<ClassroomDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { validatePreSchoolCode: ClassroomDto };
      errors?: {};
    }>(``, {
      id: 'ValidatePreSchoolCode',
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

  async addChildProgressReportPeriods(
    classroomId: string,
    childProgressReportPeriods: {
      startDate: Date;
      endDate: Date;
    }[]
  ): Promise<ChildProgressReportPeriodDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        addChildProgressReportPeriods: ChildProgressReportPeriodDto[] | null;
      };
      errors?: {};
    }>(``, {
      id: 'AddChildProgressReportPeriods',
      variables: {
        classroomId,
        childProgressReportPeriods,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'addChildProgressReportPeriods Failed - Server connection error'
      );
    }

    // The server is idempotent per classroom + reporting window: if these periods
    // (or an overlapping set) already exist, it returns the authoritative set that
    // won, so the caller can adopt those ids instead of its own local ones.
    return response.data.data.addChildProgressReportPeriods ?? [];
  }
}

export default ClassroomService;
